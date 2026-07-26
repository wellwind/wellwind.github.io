import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SiteMetaService } from './site-meta.service';

describe('SiteMetaService', () => {
  it('updates the document title and social metadata', () => {
    const service = TestBed.inject(SiteMetaService);
    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);

    service.resetMeta({
      title: 'Angular',
      description: 'Angular article',
      keywords: ['Angular', 'Material'],
      type: 'article',
      ogImage: '/assets/angular.png',
    });

    expect(title.getTitle()).toBe('Angular | 全端開發人員天梯');
    expect(meta.getTag('name="description"')?.content).toBe('Angular article');
    expect(meta.getTag('name="keywords"')?.content).toBe('Angular,Material');
    expect(meta.getTag('property="og:type"')?.content).toBe('article');
    expect(meta.getTag('name="og:image"')?.content).toBe('/assets/angular.png');
  });
});
