import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PostMetaWithSlug } from '@shared/core';
import { BlogCategoriesComponent } from './blog-categories/blog-categories.component';
import { BlogTagsComponent } from './blog-tags/blog-tags.component';

const post: PostMetaWithSlug = {
  title: 'Angular Signals',
  date: '2026-07-25 08:00:00',
  categories: ['Web Development'],
  tags: ['Angular Material'],
  summary: 'Signals',
  slug: 'angular-signals',
};

describe('blog taxonomy pages', () => {
  it('renders category counts, names, and links', () => {
    TestBed.configureTestingModule({
      imports: [BlogCategoriesComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              categories: {
                'Web Development': [post],
              },
            }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(BlogCategoriesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('共 1 個分類');
    expect(element.querySelector('a')?.textContent?.trim()).toBe(
      'Web Development',
    );
    expect(element.querySelector('a')?.getAttribute('href')).toBe(
      '/blog/categories/Web-Development',
    );
  });

  it('renders tag counts, names, and links', () => {
    TestBed.configureTestingModule({
      imports: [BlogTagsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              tags: {
                'Angular Material': [post],
              },
            }),
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(BlogTagsComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('共 1 個標籤');
    expect(element.querySelector('a')?.textContent?.trim()).toBe(
      'Angular Material',
    );
    expect(element.querySelector('a')?.getAttribute('href')).toBe(
      '/blog/tags/Angular-Material',
    );
  });
});
