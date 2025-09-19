import { SeoMetaPayload, SeoMetaPort } from '@shared/core';

export class SeoMetaPortSpy implements SeoMetaPort {
  readonly calls: SeoMetaPayload[] = [];

  resetMeta(meta: SeoMetaPayload): void {
    this.calls.push(meta);
  }

  get lastCall(): SeoMetaPayload | undefined {
    return this.calls.at(-1);
  }
}
