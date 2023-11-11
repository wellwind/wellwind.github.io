import { TestBed } from '@angular/core/testing';

import { SitePostService } from './site-post.service';

describe('SitePostService', () => {
  let service: SitePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SitePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
