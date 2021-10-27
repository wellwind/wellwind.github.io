import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogArchivesComponent } from './blog-archives.component';

describe('BlogArchivesComponent', () => {
  let component: BlogArchivesComponent;
  let fixture: ComponentFixture<BlogArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogArchivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
