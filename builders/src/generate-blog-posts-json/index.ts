import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parseMarkdownMeta } from '../../../utils';

interface Options extends JsonObject {
  markdownPostsPath: string;
  targetJsonPath: string;
}

export default createBuilder(generateBlogPostsJson);

async function generateBlogPostsJson(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const targetJsonPath = options.targetJsonPath;

  if (!markdownPostsPath || !targetJsonPath) {
    const message = `Option {markdownPostsPath} or {targetJsonPath} is not set.`;
    return {
      success: false,
      error: message,
    };
  }

  const getMarkdownMeta = (dirName: string) => {
    const slug = dirName;
    const filePath = join(markdownPostsPath, dirName, `${dirName}.md`);
    const fileContent = readFileSync(filePath).toString('utf-8');
    return parseMarkdownMeta(fileContent, slug);
  }

  context.logger.info(`Generate ${targetJsonPath} from markdown files in ${markdownPostsPath}`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .map(dirName => getMarkdownMeta(dirName))
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

  context.logger.info('Done');
  return { success: true };
}