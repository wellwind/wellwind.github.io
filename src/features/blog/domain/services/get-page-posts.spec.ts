import { PostMetaWithSlug } from '@shared/core';
import { postMetaBuilder } from '@shared/testing';
import { getPagePosts } from './get-page-posts';

describe('getPagePosts', () => {
  const posts: PostMetaWithSlug[] = Array.from({ length: 5 }, (_, index) =>
    postMetaBuilder({ slug: `post-${index + 1}`, title: `post-${index + 1}` }),
  );

  it('returns posts for the requested page', () => {
    const result = getPagePosts(2, 2, posts);

    expect(result.map((post) => post.slug)).toEqual(['post-3', 'post-4']);
  });

  it('returns the remainder of posts on the final page', () => {
    const result = getPagePosts(3, 2, posts);

    expect(result.map((post) => post.slug)).toEqual(['post-5']);
  });
});
