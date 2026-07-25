import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { CommentComponent } from './site-common/comment.component';
import { PlatformService } from '@shared/infrastructure';
import { SiteMetaService } from './site-common/site-meta.service';

describe('component router subscriptions', () => {
  let routerEvents: Subject<NavigationStart | NavigationEnd>;
  let resetMeta: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    routerEvents = new Subject<NavigationStart | NavigationEnd>();
    resetMeta = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents,
            navigate: vi.fn(),
            navigateByUrl: vi.fn(),
          },
        },
        {
          provide: PlatformService,
          useValue: {
            isServer: true,
            isSmallScreen: signal(false),
          },
        },
        {
          provide: SiteMetaService,
          useValue: { resetMeta },
        },
      ],
    });
  });

  it('stops the app-level navigation subscription when destroyed', () => {
    TestBed.overrideComponent(AppComponent, {
      set: { imports: [], template: '' },
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    routerEvents.next(new NavigationStart(1, '/first'));
    expect(resetMeta).toHaveBeenCalledOnce();

    fixture.destroy();
    routerEvents.next(new NavigationStart(2, '/second'));

    expect(resetMeta).toHaveBeenCalledOnce();
  });

  it('stops all layout navigation subscriptions when destroyed', () => {
    TestBed.overrideComponent(LayoutComponent, {
      set: { imports: [], template: '' },
    });
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();

    expect(routerEvents.observed).toBe(true);

    fixture.destroy();

    expect(routerEvents.observed).toBe(false);
  });

  it('stops all comment navigation subscriptions when destroyed', () => {
    const fixture = TestBed.createComponent(CommentComponent);
    fixture.detectChanges();

    expect(routerEvents.observed).toBe(true);

    fixture.destroy();

    expect(routerEvents.observed).toBe(false);
  });
});
