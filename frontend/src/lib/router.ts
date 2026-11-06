const getRouterBasename = () => {
  const ogTitleMeta = document.querySelector('meta[property="og:root_path"]');
  if (ogTitleMeta && typeof ogTitleMeta.getAttribute('content') === 'string') {
    return ogTitleMeta.getAttribute('content')!;
  } else {
    return '';
  }
};

/**
 * Prefix an app-absolute URL with the root path the app is served under.
 *
 * URLs that Vite inlines at build time — `?url` assets, and the pdf.js worker
 * is one — are baked as `/assets/...` and know nothing about
 * CHAINLIT_ROOT_PATH, so an app mounted on a subpath requests them from the
 * server root and gets a 404.
 *
 * @param url An app-absolute URL, e.g. `/assets/pdf.worker.min.mjs`.
 * @param basename The root path, defaulting to the one baked into the page.
 * @returns `url` untouched when there is no root path or it is not
 *          app-absolute, otherwise `url` under `basename`.
 */
export const withRouterBasename = (
  url: string,
  basename: string = getRouterBasename()
): string => {
  const prefix = basename.replace(/\/+$/, '');
  if (!prefix || !url.startsWith('/')) {
    return url;
  }
  return `${prefix}${url}`;
};

export default getRouterBasename;
