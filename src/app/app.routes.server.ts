import { RenderMode, ServerRoute } from '@angular/ssr';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

let prerenderPaths: Promise<string[]> | undefined;

const getPrerenderPaths = () =>
  (prerenderPaths ??= readFile(resolve(process.cwd(), 'pages.txt'), 'utf8').then(
    (routes) =>
      routes
        .split(/\r?\n/)
        .map((path) => path.trim())
        .filter(Boolean),
  ));

const getParams = async (
  pattern: RegExp,
  parameterNames: readonly string[],
) => {
  const paths = await getPrerenderPaths();

  return paths.flatMap((path) => {
    const match = path.match(pattern);
    if (!match) {
      return [];
    }

    return [
      Object.fromEntries(
        parameterNames.map((name, index) => [name, match[index + 1]]),
      ),
    ];
  });
};

const getPostParams = () =>
  getParams(/^\/blog\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/?$/, [
    'yyyy',
    'mm',
    'dd',
    'slug',
  ]);

export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:yyyy/:mm/:dd/:slug/',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getPostParams,
  },
  {
    path: 'blog/:yyyy/:mm/:dd/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getPostParams,
  },
  {
    path: 'blog/categories/:category-slug/page/:page',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/categories\/([^/]+)\/page\/([^/]+)$/, [
        'category-slug',
        'page',
      ]),
  },
  {
    path: 'blog/categories/:category-slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/categories\/([^/]+)$/, ['category-slug']),
  },
  {
    path: 'blog/tags/:tag-slug/page/:page',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/tags\/([^/]+)\/page\/([^/]+)$/, [
        'tag-slug',
        'page',
      ]),
  },
  {
    path: 'blog/tags/:tag-slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/tags\/([^/]+)$/, ['tag-slug']),
  },
  {
    path: 'blog/archives/page/:page',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/archives\/page\/([^/]+)$/, ['page']),
  },
  {
    path: 'blog/page/:page',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      getParams(/^\/blog\/page\/([^/]+)$/, ['page']),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
