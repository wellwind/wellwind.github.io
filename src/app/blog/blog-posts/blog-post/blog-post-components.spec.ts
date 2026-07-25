import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MarkdownMeta } from '@shared/core';
import { PlatformService } from '@shared/infrastructure';
import { BlogLayoutComponent } from '../../blog-layout.component';
import { SitePostService } from '../../../site-common/site-post.service';
import { BlogPostSubtitleComponent } from '../../../site-common/blog-post-subtitle.component';
import { BlogPostComponent } from './blog-post.component';
import { BlogPostTocComponent } from './blog-post-toc.component';

const postMeta: MarkdownMeta = {
  slug: 'angular-signals',
  title: 'Angular Signals',
  date: '2026-07-25 08:00:00',
  categories: ['Web Development'],
  tags: ['Angular'],
  summary: '<p>Reactive state.</p>',
  content: '<h2 id="details">Details</h2>',
  originalContent: '',
};

const platformService = {
  isServer: true,
  isSmallScreen: signal(false),
};

describe('blog post presentation components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PlatformService, useValue: platformService },
      ],
    });
  });

  it('renders subtitle metadata and category links', () => {
    const fixture = TestBed.createComponent(BlogPostSubtitleComponent);
    fixture.componentRef.setInput('postMeta', postMeta);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('2026-07-25');
    expect(element.querySelector('a')?.textContent?.trim()).toBe(
      'Web Development',
    );
    expect(element.querySelector('a')?.getAttribute('href')).toBe(
      '/blog/categories/Web-Development',
    );
  });

  it('renders the blog layout navigation controls', () => {
    const fixture = TestBed.createComponent(BlogLayoutComponent);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'button[aria-label="回到最上面"]',
      ),
    ).not.toBeNull();
  });

  it('renders article content and taxonomy links', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { data: of({ content: postMeta }) },
    });
    TestBed.overrideProvider(SitePostService, {
      useValue: {
        categoriesAndPosts: signal({}),
        postsMetaWithSlugAndSortAsc: signal([]),
      },
    });

    const fixture = TestBed.createComponent(BlogPostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain(
      'Angular Signals',
    );
    expect(element.querySelector('section')?.textContent).toContain(
      'Reactive state.',
    );
    expect(
      element
        .querySelector('a[href="/blog/tags/Angular"]')
        ?.textContent?.trim(),
    ).toBe('Angular');
  });

  it('builds a table of contents from article headings', async () => {
    const content = document.createElement('article');
    content.innerHTML = '<h2>Overview</h2><h3>Details</h3>';

    const fixture = TestBed.createComponent(BlogPostTocComponent);
    fixture.componentRef.setInput('contentElement', content);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const headings = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('.toc-item a'),
      (element) => element.textContent?.trim(),
    );
    expect(headings).toEqual(['Overview', 'Details']);
  });
});
