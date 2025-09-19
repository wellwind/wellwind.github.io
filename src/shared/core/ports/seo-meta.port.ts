export type SeoMetaType = 'website' | 'article';

export interface SeoMetaPayload {
  title: string;
  description: string;
  keywords: string[];
  type: SeoMetaType;
  ogImage?: string;
}

export interface SeoMetaPort {
  resetMeta(meta: SeoMetaPayload): void;
}

export const createNoopSeoMetaPort = (): SeoMetaPort => ({
  resetMeta: () => undefined,
});
