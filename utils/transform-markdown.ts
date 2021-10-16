import * as markdownIt from 'markdown-it';

const markdown = markdownIt();

export const transformMarkdown = (content: string, slug: string) => markdown
  // 轉成基本的 HTML
  .render(content)
  // 特殊語法轉換
  // 圖片轉換
  .replace(/\{% asset_img (.*) (.*)%\}/g, `<img src="./assets/blog/${slug}/$1" alt="$2" />`)
  // {% note %} 轉換
  .replace(/{%\s*note (.*)%}(.*){%\s*endnote\s*%}/s, `<div class=note $1>$2</div>`)
