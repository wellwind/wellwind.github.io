import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Data, ParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { getRouteData, getRouteParam } from './route-utils';

describe('route-utils', () => {
  let paramMap$: BehaviorSubject<ParamMap>;
  let data$: BehaviorSubject<Data>;

  beforeEach(() => {
    paramMap$ = new BehaviorSubject<ParamMap>(
      convertToParamMap({ slug: 'initial' }),
    );
    data$ = new BehaviorSubject<Data>({ title: 'Initial' });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMap$.asObservable(),
            data: data$.asObservable(),
          },
        },
      ],
    });
  });

  it('exposes the latest route param as a signal', () => {
    const slugSignal = TestBed.runInInjectionContext(() =>
      getRouteParam((params) => params.get('slug'), ''),
    );

    expect(slugSignal()).toBe('initial');

    paramMap$.next(convertToParamMap({ slug: 'updated' }));

    expect(slugSignal()).toBe('updated');
  });

  it('exposes route data as a signal', () => {
    const titleSignal = TestBed.runInInjectionContext(() =>
      getRouteData((data) => data['title'] as string, ''),
    );

    expect(titleSignal()).toBe('Initial');

    data$.next({ title: 'Updated' });

    expect(titleSignal()).toBe('Updated');
  });
});
