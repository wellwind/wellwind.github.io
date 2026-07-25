import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
  });

  it('renders only the current page when there is one page', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent.trim()).toBe('1');
  });

  it('renders navigation and neighboring page controls for a middle page', () => {
    fixture.componentRef.setInput('linkBase', '/blog/page');
    fixture.componentRef.setInput('currentPage', 4);
    fixture.componentRef.setInput('totalPage', 8);
    fixture.detectChanges();

    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
      (button: Element) => button.getAttribute('aria-label'),
    );
    expect(labels).toEqual([
      null,
      '第一頁',
      '第 3 頁',
      '第 4 頁',
      '第 5 頁',
      '最後一頁',
      '下一頁',
    ]);
  });
});
