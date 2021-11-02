import * as markdownIt from 'markdown-it';

const markdown = markdownIt({
  linkify: true,
  typographer: true
});

export const transformMarkdown = (content: string, slug: string) => markdown
  // 轉成基本的 HTML
  .render(content)
  // 特殊語法轉換
  // title anchor
  .replace(
    /<h([1-6])(.*)>(.*)<\/h([1-6])>/g,
    (match, head1, headAttr, title, head2) => {
      const slug = title.trim().replace(/ /g, '-').toLowerCase();
      return `<h${head1}${headAttr} id="${slug}">${title}</h${head2}>`;
    })
  // 圖片轉換
  .replace(
    /\{% asset_img (.*?)\s(.*?)%\}/g,
    `<img src="./assets/blog/${slug}/$1" alt="$2" title="$2" />`)
  // lazy loading 圖片
  .replace(
    /<img(.*)\/>/,
    `<img$1 loading="lazy" />`
  )
  // {% note %} 轉換
  .replace(
    /<p>{% note (.*?) %}<\/p>(.*?)<p>{% endnote %}<\/p>/gs,
    (match, noteClass, content) => {
      const newContent = content.trim().replace(/^\s+|\s+$/g, '');
      return `</p><div class=\"note ${noteClass}\">${newContent}</div><p>`
    })
