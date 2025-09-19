import { PostMetaWithSlug } from '@shared/core';
import { postMetaBuilder } from '@shared/testing';
import { findPosts } from './find-posts';

describe('findPosts', () => {
  const postsByCategory: Record<string, PostMetaWithSlug[]> = {
    'Frontend Favorites': [postMetaBuilder({ slug: 'angular', title: 'angular' })],
    'Backend Basics': [postMetaBuilder({ slug: 'node', title: 'node' })],
  };

  it('returns matched posts when slugified key exists', () => {
    const result = findPosts('Frontend-Favorites', postsByCategory);

    expect(result.map((post) => post.slug)).toEqual(['angular']);
  });

  it('returns an empty array when the slug is not present', () => {
    const result = findPosts('non-existent', postsByCategory);

    expect(result).toEqual([]);
  });
});
