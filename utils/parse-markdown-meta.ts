import * as yaml from 'js-yaml';
import { MarkdownMeta } from './markdown-meta';
import { MarkdownYamlMeta } from './parse-markdown-meta.interface';
import { getContentPath, transformMarkdown } from './transform-markdown';

const markdownYamlMetaPattern = /^(?:\-\-\-)(.*?)(?:\-\-\-|\.\.\.)/s

export const parseMarkdownMeta = (markdownContent: string, slug: string) => {
  const yamlMetaMatch = markdownContent.match(markdownYamlMetaPattern);

  // 沒指定 metadata 則不使用
  if (!yamlMetaMatch || yamlMetaMatch.length <= 1) {
    return null;
  }

  if (yamlMetaMatch && yamlMetaMatch.length > 1) {
    // 解析開頭的 yaml meta
    const yamlContent = yamlMetaMatch[1];
    const yamlMeta = yaml.load(yamlContent) as MarkdownYamlMeta;

    // 解析 <!-- more -->
    const blogContent = markdownContent.replace(yamlMetaMatch[0], '');
    const blogContentChunks = blogContent.split(/<!--\s*more\s*-->/);
    // 將內容重新組合
    let summary = '';
    let content = '';
    if (blogContentChunks.length === 1) {
      summary = blogContentChunks[0];
      content = blogContentChunks[0];
    } else {
      summary = blogContentChunks[0];
      content = blogContentChunks.slice(1).join('\r\n');
    }

    return <MarkdownMeta>{
      slug: slug,
      title: yamlMeta.title,
      date: new Date(yamlMeta.date)
        .toISOString()
        .slice(0, 19)
        .replace(/T/g, ' '),
      categories: typeof yamlMeta.category === 'string' ? [yamlMeta.category] : yamlMeta.category,
      tags: yamlMeta.tags,
      ogImage: yamlMeta.ogImage ? `${getContentPath(slug)}/${yamlMeta.ogImage}` : undefined,
      draft: !!yamlMeta.draft,
      summary: transformMarkdown(summary, slug),
      content: transformMarkdown(content, slug),
      originalContent: markdownContent
    }
  }

  return null;
}
