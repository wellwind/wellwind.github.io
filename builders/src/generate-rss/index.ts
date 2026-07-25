import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { Feed } from 'feed';
import { readdirSync, writeFileSync } from 'fs';
import { descend, prop, sortWith, take } from 'ramda';
import { MarkdownMeta } from '@shared/core';
import { getMarkdownMeta } from '@features/post-detail/domain/services/get-markdown-meta';

interface Options extends JsonObject {
  markdownPostsPath: string;
  postCount: number;
  rssPath: string;
  rssConfig: {
    siteUrl: string;
    title: string;
    description: string;
    favicon: string;
    copyright: string;
    author: {
      name: string;
      email: string;
      link: string;
    }
  }
}

export default createBuilder(generateRss);

async function generateRss(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const rssPath = options.rssPath;

  context.logger.info(`📒 Generate ${rssPath}.`);

  const allPosts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName))
    .filter((post): post is MarkdownMeta => post !== null);

  const posts = take(
    options.postCount,
    sortWith([descend(prop('date'))], allPosts),
  );

  const siteUrl = options.rssConfig.siteUrl;
  const feed = new Feed({
    title: options.rssConfig.title,
    description: options.rssConfig.description,
    id: siteUrl,
    link: siteUrl,
    language: 'zh',
    favicon: `${siteUrl}/${options.rssConfig.favicon}`,
    copyright: options.rssConfig.copyright,
    author: options.rssConfig.author
  });

  posts.forEach(post => {
    const dateFormatted = post.date.slice(0, 10).replace(/-/g, '/');

    feed.addItem({
      title: post.title,
      id: `${siteUrl}blog/${dateFormatted}/${post.slug}`,
      link: `${siteUrl}blog/${dateFormatted}/${post.slug}`,
      description: post.summary,
      date: new Date(post.date),
    });
  })

  writeFileSync(rssPath, feed.rss2());

  context.logger.info('✅ Done');
  return { success: true };
}
