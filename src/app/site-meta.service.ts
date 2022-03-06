import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SiteMetaService {

  constructor(private title: Title, private meta: Meta) {
  }

  resetMeta(options: { title: string, description: string, keywords: string[], type: 'website' | 'article', ogImage?: string }) {
    const siteName = '全端開發人員天梯'
    const pageTitle = `${options.title}${options.title ? ' | ' : ''}${siteName}`;
    this.title.setTitle(pageTitle);

    const tags: MetaDefinition[] = [
      { name: 'keywords', content: options.keywords.join(',') },
      { name: 'description', content: options.description },
      { property: 'og:type', content: options.type },
      { property: 'og:title', content: pageTitle },
      { property: 'og:site_name', content: siteName },
      { property: 'og:description', content: options.description },
      { property: 'og:locale', content: 'zh-tw' },
      { name: 'og:image', content: options.ogImage || '' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: options.description }
    ];
    tags.forEach(tag => {
      this.meta.removeTag(`name="${tag.name}"`);
      this.meta.removeTag(`property="${tag.property}"`);
      this.meta.addTag(tag);
    });
  }
}
