import { BlogPostTagSizePipe } from '../blog/blog-tags/blog-post-tag-size.pipe';
import { PostDateAsPathPipe } from './post-date-as-path.pipe';
import { SlugifyPipe } from './slugify.pipe';
import { UnslugifyPipe } from './unslugify.pipe';

describe('blog display pipes', () => {
  it('converts names to and from URL slugs', () => {
    expect(new SlugifyPipe().transform('Angular  Material')).toBe(
      'Angular-Material',
    );
    expect(new UnslugifyPipe().transform('Angular--Material')).toBe(
      'Angular Material',
    );
    expect(new SlugifyPipe().transform('C#')).toBe('C~23~');
    expect(new UnslugifyPipe().transform('C~23~')).toBe('C#');
    expect(new SlugifyPipe().transform('*ngIf')).toBe('~2A~ngIf');
    expect(new UnslugifyPipe().transform('~2A~ngIf')).toBe('*ngIf');
  });

  it('builds the canonical dated route for a post', () => {
    const route = new PostDateAsPathPipe().transform({
      title: 'Signals',
      date: '2026-07-25 08:30:00',
      categories: [],
      tags: [],
      summary: '',
      slug: 'signals',
    });

    expect(route).toEqual(['/blog', '2026', '07', '25', 'signals']);
  });

  it('maps tag frequency to the four visual size levels', () => {
    const pipe = new BlogPostTagSizePipe();

    expect(pipe.transform(4, 10)).toBe(1);
    expect(pipe.transform(2, 10)).toBe(2);
    expect(pipe.transform(1, 10)).toBe(3);
    expect(pipe.transform(0, 10)).toBe(4);
  });
});
