import { toSignal } from '@angular/core/rxjs-interop';
import { Signal, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { map } from 'rxjs';

export const getRouteParam = <T>(getFn: (paramMap: ParamMap, index?: number) => T, initialValue: T) => {
  const route = inject(ActivatedRoute);
  const param$ = route.paramMap.pipe(
    map(getFn)
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return toSignal<T>(param$, { initialValue: initialValue as any }) as Signal<T>;
};

export const getRouteData = <T>(getFn: (data: Data, index?: number) => T, initialValue: T) => {
  const route = inject(ActivatedRoute);
  const data$ = route.data.pipe(
    map(getFn)
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return toSignal<T>(data$, { initialValue: initialValue as any })as Signal<T>;
}
