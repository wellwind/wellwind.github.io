import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, writeFileSync } from 'fs';
import { range } from 'ramda';
import { getMarkdownMeta } from '../../../utils/get-markdown-meta';
import { slugify } from '../../../utils/slugify';

interface Options extends JsonObject {
  markdownPostsPath: string;
  urlsPath: string;
}

const PAGE_SIZE = 10;

const getPageCount = (input: any[]) => Math.ceil(input.length / PAGE_SIZE);

export default createBuilder(generateUrls);

async function generateUrls(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const urlsPath = options.urlsPath;

  const urls = [
    '/blog',
    '/blog/categories',
    '/blog/tags',
    '/blog/archives'
  ];

  context.logger.info(`🔁 Generate ${urlsPath}.`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName));

  //#region Post pages

  context.logger.info(`📝 Generating post pages.`);

  // single post
  const postPages = posts.map(post => `/blog/${post.date
    .slice(0, 10)
    .replace(/-/g, '/')}/${post.slug}`);
  urls.push(...postPages);

  // posts page
  const pageCount = getPageCount(posts);
  const postPageNumbers = range(1, pageCount + 1).map(pageNumber => `/blog/page/${pageNumber}`);
  urls.push(...postPageNumbers);

  //#endregion

  //#region Category pages

  context.logger.info(`📁 Generating category pages.`);

  // categories page
  const categoriesInPosts = posts
    .reduce((prev, curr) => ([...prev, ...(curr.categories || [])]), [] as string[])
    .filter(category => !!category);
  const categories = [...new Set(categoriesInPosts)];
  const categoryUrls = categories
    .reduce((prev, category) => {
      const categorySlug = slugify(category);
      const categoryPosts = posts.filter(post => (post.categories || []).find(cat => cat === category));
      const categoryPostsPageCount = getPageCount(categoryPosts);

      return [
        ...prev,
        `/blog/categories/${categorySlug}`,
        ...(categoryPostsPageCount > 1
          ? range(1, categoryPostsPageCount + 1).map(pageNumber => `/blog/categories/${categorySlug}/page/${pageNumber}`)
          : [])
      ];
    }, []);
  urls.push(...categoryUrls);

  //#endregion

  //#region Tag pages

  context.logger.info(`🏷  Generating tag pages.`);

  const tagsInPosts = posts
    .reduce((prev, curr) => ([...prev, ...(curr.tags || [])]), [] as string[])
    .filter(tag => !!tag);
  const tags = [...new Set(tagsInPosts)];
  const tagUrls = tags
    .reduce((prev, tagName) => {
      const tagSlug = slugify(tagName);
      const tagPosts = posts.filter(post => (post.tags || []).find(tag => tag === tagName));
      const tagPostsPageCount = getPageCount(tagPosts);

      return [
        ...prev,
        `/blog/tags/${tagSlug}`,
        ...(tagPostsPageCount > 1
          ? range(1, tagPostsPageCount + 1).map(pageNumber => `/blog/tags/${tagSlug}/page/${pageNumber}`)
          : [])
      ];
    }, []);
  urls.push(...tagUrls);

  //#endregion

  //#region Archive pages

  context.logger.info(`🪣  Generating archive pages.`);

  // archive page
  const archivePageCount = getPageCount(posts);
  const archivePageNumbers = range(1, archivePageCount + 1).map(pageNumber => `/blog/archives/page/${pageNumber}`);
  urls.push(...archivePageNumbers);

  //#endregion

  writeFileSync(urlsPath, urls.join('\n'));

  context.logger.info('✅ Done.');
  return { success: true };
}
