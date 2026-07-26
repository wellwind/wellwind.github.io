import { getMarkdownMeta } from '@features/post-detail/domain/services/get-markdown-meta';
import { MarkdownMeta } from '@shared/core';
import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, writeFileSync } from 'fs';

interface Options extends JsonObject {
  markdownPostsPath: string;
  targetJsonPath: string;
}

type BlogPostIndexEntry = Pick<
  MarkdownMeta,
  'title' | 'date' | 'categories' | 'tags' | 'summary' | 'ogImage'
>;

export default createBuilder(generateBlogPostsJson);

async function generateBlogPostsJson(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const targetJsonPath = options.targetJsonPath;

  context.logger.info(`📃 Generate ${targetJsonPath} from markdown files in ${markdownPostsPath}`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName))
    .filter((markdownMeta): markdownMeta is MarkdownMeta => markdownMeta !== null)
    .filter(markdownMeta => !markdownMeta.draft)
    .reduce((prev, markdownMeta) => ({
      ...prev,
      [markdownMeta.slug]: {
        title: markdownMeta.title,
        date: markdownMeta.date,
        categories: markdownMeta.categories,
        tags: markdownMeta.tags,
        summary: markdownMeta.summary,
        ogImage: markdownMeta.ogImage
      }
    }), {} as Record<string, BlogPostIndexEntry>)

  writeFileSync(targetJsonPath, JSON.stringify(posts));

  context.logger.info('✅ Done');
  return { success: true };
}
