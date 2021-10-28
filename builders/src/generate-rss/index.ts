import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';
import { readdirSync, writeFileSync } from 'fs';
import { getMarkdownMeta } from '../../../utils/get-markdown-meta';
import { Feed } from 'feed';

interface Options extends JsonObject {
  markdownPostsPath: string;
  rssPath: string;
}

export default createBuilder(generateRss);

async function generateRss(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const markdownPostsPath = options.markdownPostsPath;
  const rssPath = options.rssPath;

  context.logger.info(`Generate 📒 ${rssPath}.`);

  const posts = readdirSync(markdownPostsPath, { withFileTypes: true })
    .filter(dirent => dirent.isFile() && dirent.name.endsWith('.md'))
    .map(dirent => dirent.name)
    .map(fileName => getMarkdownMeta(markdownPostsPath, fileName));

  const siteUrl = 'https://fullstackladder.dev/';
  const feed = new Feed({
    title: '全端開發人員天梯',
    description: '軟體開發學不完，就像爬不完的天梯，只好多紀錄寫筆記',
    id: siteUrl,
    link: siteUrl,
    language: 'zh',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: 'All rights reserved 2021, Mike Huang',
    author: {
      name: 'Mike Huang',
      email: 'wellwind@gmail.com',
      link: siteUrl
    }
  });

  posts.forEach(post => {
    const dateFormatted = new Date(post.date).toISOString().slice(0, 10).replace(/-/g, '/');

    feed.addItem({
      title: post.title,
      id: `${siteUrl}${dateFormatted}/${post.slug}`,
      link: `${siteUrl}${dateFormatted}/${post.slug}`,
      description: post.summary,
      date: new Date(post.date),
    });
  })

  writeFileSync(rssPath, feed.rss2());

  context.logger.info('✅ Done');
  return { success: true };
}
