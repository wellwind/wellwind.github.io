import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTagPostsComponent } from './blog-tag-posts.component';

describe('BlogTagPostsComponent', () => {
  let component: BlogTagPostsComponent;
  let fixture: ComponentFixture<BlogTagPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogTagPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogTagPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
