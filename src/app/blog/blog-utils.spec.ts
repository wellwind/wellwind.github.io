import { findPosts, getPagePosts } from '@features/blog/domain';
import { PostMetaWithSlug } from '@shared/core';

const posts: PostMetaWithSlug[] = Array.from({ length: 12 }, (_, index) => ({
  title: `Post ${index + 1}`,
  date: `2026-01-${String(index + 1).padStart(2, '0')}`,
  categories: ['Angular Material'],
  tags: ['Angular'],
  summary: `Summary ${index + 1}`,
  slug: `post-${index + 1}`,
}));

describe('blog utilities', () => {
  it('returns the requested page without mutating the source collection', () => {
    const result = getPagePosts(2, 5, posts);

    expect(result.map((post) => post.slug)).toEqual([
      'post-6',
      'post-7',
      'post-8',
      'post-9',
      'post-10',
    ]);
    expect(posts.length).toBe(12);
  });

  it('finds grouped posts by their slugified group name', () => {
    expect(findPosts('Angular-Material', { 'Angular Material': posts })).toBe(
      posts,
    );
    expect(findPosts('C~23~', { 'C#': posts })).toBe(posts);
    expect(findPosts('~2A~ngIf', { '*ngIf': posts })).toBe(posts);
  });

  it('returns an empty collection when a group cannot be found', () => {
    expect(findPosts('missing', { Angular: posts })).toEqual([]);
  });
});
