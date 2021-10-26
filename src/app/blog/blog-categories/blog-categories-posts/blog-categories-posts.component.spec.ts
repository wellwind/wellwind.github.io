import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCategoriesPostsComponent } from './blog-categories-posts.component';

describe('BlogCategoriesPostsComponent', () => {
  let component: BlogCategoriesPostsComponent;
  let fixture: ComponentFixture<BlogCategoriesPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogCategoriesPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogCategoriesPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
