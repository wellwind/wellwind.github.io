import { PostMetaWithSlug } from '@shared/core';
import { postMetaBuilder } from '@shared/testing';
import { searchPosts, searchPostsByDateRange } from './search-posts';

describe('searchPosts', () => {
  const posts: PostMetaWithSlug[] = [
    postMetaBuilder({
      title: 'Angular Signals Deep Dive',
      slug: 'angular-signals',
      categories: ['Frontend'],
      tags: ['Angular', 'RxJS'],
      summary: 'A guide to Angular signals and RxJS interop',
      date: '2024-03-10 12:00:00',
    }),
    postMetaBuilder({
      title: 'RxJS In Practice',
      slug: 'rxjs-in-practice',
      categories: ['Frontend'],
      tags: ['RxJS'],
      summary: 'Practical patterns with RxJS operators',
      date: '2024-02-01 08:30:00',
    }),
    postMetaBuilder({
      title: 'Node Deployment Handbook',
      slug: 'node-deployment',
      categories: ['Backend'],
      tags: ['Node'],
      summary: 'Deploy Node services reliably',
      date: '2023-12-20 09:15:00',
    }),
  ];

  it('maps posts to article results when keyword is empty', () => {
    const result = searchPosts(posts, '');

    expect(result.length).toBe(3);
    expect(result.every((item) => item.type === '文章')).toBeTrue();
    expect(result.map((item) => item.link)).toEqual([
      '/blog/2024/03/10/angular-signals',
      '/blog/2024/02/01/rxjs-in-practice',
      '/blog/2023/12/20/node-deployment',
    ]);
  });

  it('filters posts by keyword inside title and summary', () => {
    const result = searchPosts(posts, 'RxJS');

    expect(result.length).toBe(3);
    expect(result[0]).toEqual(
      jasmine.objectContaining({ type: '文章', text: 'Angular Signals Deep Dive' }),
    );
    expect(result[1]).toEqual(
      jasmine.objectContaining({ type: '文章', text: 'RxJS In Practice' }),
    );
    expect(result[2]).toEqual(
      jasmine.objectContaining({ type: '標籤', text: 'RxJS' }),
    );
  });

  it('filters by category when using post search syntax', () => {
    const result = searchPosts(posts, 'category:Frontend:Angular');

    expect(result.length).toBe(1);
    expect(result[0]).toEqual(
      jasmine.objectContaining({
        type: '分類:Frontend;文章',
        text: 'Angular Signals Deep Dive',
        link: '/blog/2024/03/10/angular-signals',
      }),
    );
  });

  it('returns tag matches when searching only for tags', () => {
    const result = searchPosts(posts, 'tag:rxjs');

    expect(result).toContain(
      jasmine.objectContaining({
        type: '標籤',
        text: 'RxJS',
        link: '/blog/tags/RxJS',
      }),
    );
  });

  it('returns category matches when searching only for categories', () => {
    const result = searchPosts(posts, 'category:front');

    expect(result).toContain(
      jasmine.objectContaining({
        type: '分類',
        text: 'Frontend',
        link: '/blog/categories/Frontend',
      }),
    );
  });
});

describe('searchPostsByDateRange', () => {
  const posts: PostMetaWithSlug[] = [
    postMetaBuilder({
      title: 'Early Post',
      slug: 'early',
      date: '2024-01-01 00:00:00',
    }),
    postMetaBuilder({
      title: 'Mid Post',
      slug: 'mid',
      date: '2024-02-15 00:00:00',
    }),
    postMetaBuilder({
      title: 'Late Post',
      slug: 'late',
      date: '2024-04-01 00:00:00',
    }),
  ];

  it('returns posts inside the provided date range', () => {
    const result = searchPostsByDateRange(
      new Date('2024-01-15'),
      new Date('2024-03-01'),
    )(posts);

    expect(result.map((post) => post.slug)).toEqual(['mid']);
  });

  it('treats open-ended ranges as unbounded', () => {
    const fromOnly = searchPostsByDateRange(new Date('2024-02-01'), undefined)(posts);
    const toOnly = searchPostsByDateRange(undefined, new Date('2024-02-01'))(posts);

    expect(fromOnly.map((post) => post.slug)).toEqual(['mid', 'late']);
    expect(toOnly.map((post) => post.slug)).toEqual(['early']);
  });
});
