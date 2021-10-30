import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parseMarkdownMeta } from '../../../utils';
import { getMarkdownMeta } from '../../../utils/get-markdown-meta';

interface Options extends JsonObject {
  markdownPostsPath: string;
  targetJsonPath: string;
}

export default createBuilder(generateBlogPostsJson);

async function generateBlogPostsJson(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const targetJsonPath = options.targetJsonPath;

  context.logger.info(`📃 Generate ${targetJsonPath} from markdown files in ${markdownPostsPath}`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName))
    .filter(markdownMeta => !!markdownMeta)
    .filter(markdownMeta => !markdownMeta?.draft)
    .reduce((prev, markdownMeta) => ({
      ...prev,
      [markdownMeta!.slug]: {
        title: markdownMeta!.title,
        date: markdownMeta!.date,
        categories: markdownMeta!.categories,
        tags: markdownMeta!.tags,
        summary: markdownMeta!.summary
      }
    }), {} as any)

  writeFileSync(targetJsonPath, JSON.stringify(posts));

  context.logger.info('✅ Done');
  return { success: true };
}
