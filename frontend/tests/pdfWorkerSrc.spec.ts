import { afterEach, describe, expect, it } from 'vitest';

import getRouterBasename, { withRouterBasename } from '@/lib/router';

const WORKER = '/assets/pdf.worker.min-abc123.mjs';

const setRootPath = (rootPath: string) => {
  document.head.innerHTML = `<meta property="og:root_path" content="${rootPath}">`;
};

afterEach(() => {
  document.head.innerHTML = '';
});

describe('withRouterBasename – assets under CHAINLIT_ROOT_PATH', () => {
  it('prefixes an app-absolute worker URL with the root path', () => {
    setRootPath('/spec_bot');

    expect(withRouterBasename(WORKER)).toBe(
      '/spec_bot/assets/pdf.worker.min-abc123.mjs'
    );
  });

  it('leaves the URL alone when the app is served from the root', () => {
    setRootPath('');

    expect(withRouterBasename(WORKER)).toBe(WORKER);
  });

  it('treats "/" as no root path, without producing a double slash', () => {
    setRootPath('/');

    expect(withRouterBasename(WORKER)).toBe(WORKER);
  });

  it('ignores a trailing slash on the root path', () => {
    setRootPath('/spec_bot/');

    expect(withRouterBasename(WORKER)).toBe(
      '/spec_bot/assets/pdf.worker.min-abc123.mjs'
    );
  });

  it('leaves an absolute URL on another origin alone', () => {
    setRootPath('/spec_bot');

    expect(withRouterBasename('https://cdn.example.com/pdf.worker.mjs')).toBe(
      'https://cdn.example.com/pdf.worker.mjs'
    );
  });

  it('leaves a relative URL alone', () => {
    setRootPath('/spec_bot');

    expect(withRouterBasename('assets/pdf.worker.mjs')).toBe(
      'assets/pdf.worker.mjs'
    );
  });

  it('reads the root path from the page when none is passed', () => {
    setRootPath('/spec_bot');

    expect(getRouterBasename()).toBe('/spec_bot');
    expect(withRouterBasename(WORKER, getRouterBasename())).toBe(
      '/spec_bot/assets/pdf.worker.min-abc123.mjs'
    );
  });
});
