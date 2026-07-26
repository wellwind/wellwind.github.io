import { searchPosts, searchPostsByDateRange } from '@features/search/domain';
import { PostMetaWithSlug } from '@shared/core';

const posts: PostMetaWithSlug[] = [
  {
    title: 'Angular Signals',
    date: '2026-01-10 08:00:00',
    categories: ['Web Development'],
    tags: ['Angular', 'Signals'],
    summary: 'Reactive state with signals',
    slug: 'angular-signals',
  },
  {
    title: 'Material Theming',
    date: '2026-02-15 08:00:00',
    categories: ['Web Development'],
    tags: ['Angular Material'],
    summary: 'Build a dark theme',
    slug: 'material-theming',
  },
  {
    title: 'TypeScript Tips',
    date: '2026-03-20 08:00:00',
    categories: ['Language'],
    tags: ['TypeScript'],
    summary: 'Useful Angular typing patterns',
    slug: 'typescript-tips',
  },
];

describe('searchPosts', () => {
  it('returns all posts as article results when the keyword is empty', () => {
    const result = searchPosts(posts, '');

    expect(result.map(({ type, text }) => ({ type, text }))).toEqual([
      { type: '文章', text: 'Angular Signals' },
      { type: '文章', text: 'Material Theming' },
      { type: '文章', text: 'TypeScript Tips' },
    ]);
    expect(result[0].link).toBe('/blog/2026/01/10/angular-signals');
  });

  it('searches article titles and summaries case-insensitively', () => {
    const result = searchPosts(posts, 'angular');

    expect(
      result.filter((item) => item.type === '文章').map((item) => item.text),
    ).toEqual(['TypeScript Tips', 'Angular Signals']);
  });

  it('supports explicit category and tag searches', () => {
    expect(searchPosts(posts, 'category:web').map((item) => item.text)).toEqual(
      ['Web Development'],
    );
    expect(searchPosts(posts, 'tag:material').map((item) => item.text)).toEqual(
      ['Angular Material'],
    );
  });

  it('supports article searches constrained to a category or tag', () => {
    expect(
      searchPosts(posts, 'category:language:angular').map((item) => item.text),
    ).toEqual(['TypeScript Tips']);
    expect(
      searchPosts(posts, 'tag:signals:reactive').map((item) => item.text),
    ).toEqual(['Angular Signals']);
  });

  it('filters posts by inclusive date boundaries', () => {
    const result = searchPostsByDateRange(
      new Date('2026-02-15 08:00:00'),
      new Date('2026-03-20 08:00:00'),
    )(posts);

    expect(result.map((post) => post.slug)).toEqual([
      'material-theming',
      'typescript-tips',
    ]);
  });
});
