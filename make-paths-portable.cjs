const fs = require('fs');
const path = require('path');

const root = __dirname;
const APPLY = process.argv.includes('--apply');
const BACKUP_DIR = path.join(root, '_backup-portable-paths');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '_backup-portable-paths'
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;

    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, '/');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function backup(file) {
  if (!APPLY) return;

  const target = path.join(BACKUP_DIR, rel(file));
  ensureDir(path.dirname(target));

  if (!fs.existsSync(target)) {
    fs.copyFileSync(file, target);
  }
}

function splitSuffix(url) {
  const match = url.match(/^([^?#]*)(.*)$/);
  return {
    pathname: match ? match[1] : url,
    suffix: match ? match[2] : ''
  };
}

function relativeUrlForFile(sourceFile, rootUrl) {
  if (!rootUrl.startsWith('/') || rootUrl.startsWith('//')) return rootUrl;

  const { pathname, suffix } = splitSuffix(rootUrl);
  const sourceDir = path.dirname(sourceFile);

  // "/" = racine du site.
  const target = pathname === '/'
    ? root
    : path.join(root, pathname.slice(1));

  let result = path.relative(sourceDir, target).replace(/\\/g, '/');

  if (!result) result = './';

  // Un navigateur interprète "assets/..." comme relatif.
  // On ajoute "./" seulement quand cela améliore la lisibilité.
  if (!result.startsWith('.') && !result.startsWith('/')) {
    result = './' + result;
  }

  // Si la cible d'origine était un dossier, on garde le slash final.
  if (pathname.endsWith('/') && !result.endsWith('/')) {
    result += '/';
  }

  return result + suffix;
}

function siteRootRelativeForHtml(file) {
  let result = path.relative(path.dirname(file), root).replace(/\\/g, '/');
  if (!result) return './';
  if (!result.startsWith('.')) result = './' + result;
  if (!result.endsWith('/')) result += '/';
  return result;
}

function updateHtml(file, html) {
  let out = html;
  let count = 0;

  // Supprime une ancienne balise site-root si le script est relancé.
  out = out.replace(/\s*<meta\s+name=["']site-root["'][^>]*>\s*/gi, '\n');

  const meta = `    <meta name="site-root" content="${siteRootRelativeForHtml(file)}">\n`;

  if (/<head\b[^>]*>/i.test(out)) {
    out = out.replace(/<head\b[^>]*>\s*/i, match => `${match}\n${meta}`);
  }

  // href, src, action, poster, data-src...
  out = out.replace(
    /\b(href|src|action|poster|data-src|data-href)=("([^"]*)"|'([^']*)')/gi,
    (match, attr, quoted, d1, d2) => {
      const value = d1 ?? d2 ?? '';
      if (!value.startsWith('/') || value.startsWith('//')) return match;

      const q = quoted[0];
      const next = relativeUrlForFile(file, value);

      if (next !== value) count++;
      return `${attr}=${q}${next}${q}`;
    }
  );

  // srcset : chaque URL peut être root-relative.
  out = out.replace(
    /\bsrcset=("([^"]*)"|'([^']*)')/gi,
    (match, quoted, d1, d2) => {
      const value = d1 ?? d2 ?? '';
      const q = quoted[0];

      const next = value
        .split(',')
        .map(part => {
          const trimmed = part.trim();
          if (!trimmed) return trimmed;

          const pieces = trimmed.split(/\s+/);
          const url = pieces.shift();

          if (url && url.startsWith('/') && !url.startsWith('//')) {
            count++;
            pieces.unshift(relativeUrlForFile(file, url));
          } else if (url) {
            pieces.unshift(url);
          }

          return pieces.join(' ');
        })
        .join(', ');

      return `srcset=${q}${next}${q}`;
    }
  );

  return { out, count };
}

function updateCss(file, css) {
  let count = 0;

  const out = css.replace(
    /url\(\s*(["']?)(\/(?!\/)[^)"']+)\1\s*\)/gi,
    (match, quote, value) => {
      const next = relativeUrlForFile(file, value);
      count++;
      return `url(${quote}${next}${quote})`;
    }
  );

  return { out, count };
}

function jsHelper() {
  return `const __floridaUrl = (path) => {
  const marker = document.querySelector('meta[name="site-root"]');
  const root = marker ? new URL(marker.content, document.baseURI) : new URL('./', document.baseURI);
  return new URL(String(path).replace(/^\\//, ''), root).href;
};

`;
}

function updateJs(file, js) {
  let out = js;
  let count = 0;

  // Imports / exports statiques : on doit garder un littéral de module.
  out = out.replace(
    /\b(from\s*|import\s*)(["'])(\/(?!\/)[^"']+)\2/g,
    (match, prefix, quote, value) => {
      const next = relativeUrlForFile(file, value);
      count++;
      return `${prefix}${quote}${next}${quote}`;
    }
  );

  // import('/...')
  out = out.replace(
    /\bimport\s*\(\s*(["'])(\/(?!\/)[^"']+)\1\s*\)/g,
    (match, quote, value) => {
      count++;
      return `import(__floridaUrl(${quote}${value}${quote}))`;
    }
  );

  // Chaînes root-relative restantes utilisées pour navigation, images, fetch, etc.
  // On ignore les chemins déjà traités dans import/export grâce au fait qu'ils ne commencent plus par "/".
  const literalRe = /(["'])(\/(?!\/)[^"'\\\r\n]*)\1/g;

  out = out.replace(literalRe, (match, quote, value, offset, full) => {
    // Évite quelques contextes où une chaîne littérale doit absolument rester statique.
    const before = full.slice(Math.max(0, offset - 35), offset);

    if (/\b(?:from|import)\s*$/.test(before)) return match;

    count++;
    return `__floridaUrl(${quote}${value}${quote})`;
  });

  if (count > 0 && !out.includes('const __floridaUrl =')) {
    // Après les éventuels imports, pour respecter la syntaxe ESM.
    const importBlock = out.match(/^(?:\s*(?:import|export)\b[^\n]*\n)*/);
    const pos = importBlock ? importBlock[0].length : 0;
    out = out.slice(0, pos) + jsHelper() + out.slice(pos);
  }

  return { out, count };
}

function writeIfNeeded(file, before, after) {
  if (before === after) return false;

  if (APPLY) {
    backup(file);
    fs.writeFileSync(file, after, 'utf8');
  }

  return true;
}

const files = walk(root);
const changed = [];
let replacements = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();

  if (!['.html', '.css', '.js'].includes(ext)) continue;

  const before = fs.readFileSync(file, 'utf8');
  let result;

  if (ext === '.html') result = updateHtml(file, before);
  if (ext === '.css') result = updateCss(file, before);
  if (ext === '.js') result = updateJs(file, before);

  if (!result) continue;

  if (writeIfNeeded(file, before, result.out)) {
    changed.push(rel(file));
    replacements += result.count;
  }
}

console.log('');
console.log(APPLY ? '✅ Conversion appliquée.' : '🔎 Aperçu seulement — aucun fichier modifié.');
console.log(`Fichiers concernés : ${changed.length}`);
console.log(`Chemins convertis : ${replacements}`);

if (changed.length) {
  console.log('');
  changed.slice(0, 30).forEach(f => console.log(`- ${f}`));
  if (changed.length > 30) console.log(`… + ${changed.length - 30} autres`);
}

if (!APPLY) {
  console.log('');
  console.log('Pour appliquer :');
  console.log('node .\\make-paths-portable.cjs --apply');
} else {
  console.log('');
  console.log(`Sauvegarde créée dans : ${path.basename(BACKUP_DIR)}`);
  console.log('Teste ensuite le site en local ET sur GitHub Pages.');
  console.log('Quand tout est validé, tu pourras supprimer le dossier de sauvegarde.');
}
