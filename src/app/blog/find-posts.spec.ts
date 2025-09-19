import { findPosts } from './find-posts';
import { PostMetaWithSlug } from '../site-common/post-meta.interface';

const buildPost = (slug: string): PostMetaWithSlug => ({
  slug,
  title: slug,
  date: '2024-01-01 00:00:00',
  categories: [],
  tags: [],
  summary: '',
});

describe('findPosts', () => {
  const postsByCategory: Record<string, PostMetaWithSlug[]> = {
    'Frontend Favorites': [buildPost('angular')],
    'Backend Basics': [buildPost('node')],
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
