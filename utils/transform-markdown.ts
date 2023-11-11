import hljs from 'highlight.js';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const markedHighlightExtension = markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
});

marked.use(markedHighlightExtension);

const markdown = {
  render: (content: string) => marked.parse(content) as string,
};

export const getContentPath = (slug: string) => `./assets/blog/${slug}`;

export const transformMarkdown = (content: string, slug: string) =>
  markdown
    // 轉成基本的 HTML
    .render(content)
    // 特殊語法轉換
    // title anchor
    .replace(
      /<h([1-6])(.*)>(.*)<\/h([1-6])>/g,
      (match, head1, headAttr, title, head2) => {
        const slug = title.trim().replace(/ /g, '-').toLowerCase();
        return `<h${head1}${headAttr} id="${slug}">${title}</h${head2}>`;
      }
    )
    // 圖片轉換
    .replace(
      /\{% asset_img (.*?)\s\((.*?)\)\s%\}/g,
      `<img src="./assets/blog/${slug}/$1" $2 />`
    )
    .replace(
      /\{% asset_img (.*?)\s(.*?)%\}/g,
      `<img src="./assets/blog/${slug}/$1" alt="$2" title="$2" />`
    )
    // lazy loading 圖片
    .replace(/<img(.*)\/>/, `<img$1 loading="lazy" />`)
    // {% note %} 轉換
    .replace(
      /<p>{% note (.*?) %}<\/p>(.*?)<p>{% endnote %}<\/p>/gs,
      (match, noteClass, content) => {
        const newContent = content.trim().replace(/^\s+|\s+$/g, '');
        return `</p><div class=\"note ${noteClass}\">${newContent}</div><p>`;
      }
    )
    // {% youtube %} 轉換
    .replace(/<p>{% youtube (.*?) %}<\/p>/gs, (match, youtubeId) => {
      return `</p><div class="embed-responsive embed-responsive-16by9"><iframe src="https://www.youtube.com/embed/${youtubeId}" title="YouTube video player" class="embed-responsive-item" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p>`;
    });
