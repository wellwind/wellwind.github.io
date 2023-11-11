import { TestBed } from '@angular/core/testing';

import { SiteMetaService } from './site-meta.service';

describe('SiteMetaService', () => {
  let service: SiteMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
