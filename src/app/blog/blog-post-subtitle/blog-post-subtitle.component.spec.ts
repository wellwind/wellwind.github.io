import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostSubtitleComponent } from './blog-post-subtitle.component';

describe('BlogPostSubtitleComponent', () => {
  let component: BlogPostSubtitleComponent;
  let fixture: ComponentFixture<BlogPostSubtitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogPostSubtitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogPostSubtitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
