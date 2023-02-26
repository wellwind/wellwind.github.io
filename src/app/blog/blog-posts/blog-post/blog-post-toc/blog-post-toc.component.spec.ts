import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostTocComponent } from './blog-post-toc.component';

describe('BlogPostTocComponent', () => {
  let component: BlogPostTocComponent;
  let fixture: ComponentFixture<BlogPostTocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BlogPostTocComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
