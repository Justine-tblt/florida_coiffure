(() => {
  const script = document.currentScript;
  if (!script?.src) return;

  const siteRoot = new URL('../../', script.src);

  const resolveRootPath = value => {
    const raw = String(value ?? '').trim();
    if (!/^\/(?!\/)/.test(raw)) return raw;
    return new URL(raw.replace(/^\/+/, ''), siteRoot).href;
  };

  const fixSrcset = value => String(value ?? '')
    .split(',')
    .map(part => {
      const bits = part.trim().split(/\s+/);
      const url = bits.shift();
      return [resolveRootPath(url), ...bits].join(' ');
    })
    .join(', ');

  const fixElement = element => {
    if (!(element instanceof Element)) return;

    for (const attr of ['href', 'src', 'action', 'poster', 'data-src']) {
      const value = element.getAttribute(attr);

      if (/^\/(?!\/)/.test(value || '')) {
        element.setAttribute(attr, resolveRootPath(value));
      }
    }

    if (element.hasAttribute('srcset')) {
      const value = element.getAttribute('srcset') || '';

      if (/(^|,\s*)\//.test(value)) {
        element.setAttribute('srcset', fixSrcset(value));
      }
    }
  };

  const scan = node => {
    if (node instanceof Element) fixElement(node);

    node.querySelectorAll?.(
      '[href],[src],[action],[poster],[data-src],[srcset]'
    ).forEach(fixElement);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scan(document), { once: true });
  } else {
    scan(document);
  }

  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') {
        fixElement(record.target);
        continue;
      }

      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href', 'src', 'action', 'poster', 'data-src', 'srcset']
  });
})();
