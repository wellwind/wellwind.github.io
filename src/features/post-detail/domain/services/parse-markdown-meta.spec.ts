import { parseMarkdownMeta } from '@features/post-detail/domain';

describe('parseMarkdownMeta', () => {
  it('returns null when metadata block is missing', () => {
    const markdown = '# Title\n\nContent without front matter';

    expect(parseMarkdownMeta(markdown, 'no-meta')).toBeNull();
  });

  it('parses metadata, summary and content from markdown', () => {
    const markdownLines = [
      '---',
      'title: Clean Architecture Notes',
      'date: 2024-01-15',
      'category: Frontend',
      'tags:',
      '  - Angular',
      '  - Testing',
      'ogImage: cover.png',
      'draft: true',
      '---',
      'Intro paragraph.',
      '<!-- more -->',
      'Additional details.',
      '',
      '```ts',
      "console.log('hello');",
      '```',
    ];
    const markdown = markdownLines.join('\n');

    const meta = parseMarkdownMeta(markdown, 'clean-architecture-notes');

    expect(meta).not.toBeNull();
    expect(meta).toEqual(
      jasmine.objectContaining({
        slug: 'clean-architecture-notes',
        title: 'Clean Architecture Notes',
        date: '2024-01-15 00:00:00',
        categories: ['Frontend'],
        tags: ['Angular', 'Testing'],
        ogImage: './assets/blog/clean-architecture-notes/cover.png',
        draft: true,
      }),
    );
    expect(meta?.summary).toContain('<p>Intro paragraph.</p>');
    expect(meta?.content).toContain('Additional details.');
    expect(meta?.content).toContain('<code class="hljs language-ts">');
    expect(meta?.content).toContain('hljs-title function_');
    expect(meta?.originalContent).toBe(markdown);
  });
});
