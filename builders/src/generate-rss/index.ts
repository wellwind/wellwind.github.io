import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, writeFileSync } from 'fs';
import { range } from 'ramda';
import { getMarkdownMeta } from '../../../utils/get-markdown-meta';
import { slugify } from '../../../utils/slugify';

interface Options extends JsonObject {
  markdownPostsPath: string;
  rssPath: string;
}

export default createBuilder(generateRss);

async function generateRss(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const rssPath = options.rssPath;

  const rss

  context.logger.info(`Generate ${rssPath}.`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName));

  writeFileSync(rssPath, urls.join('\n'));

  context.logger.info('Done');
  return { success: true };
}
