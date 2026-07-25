import { toSignal } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { map } from 'rxjs';

export const getRouteParam = <T>(
  getFn: (paramMap: ParamMap, index?: number) => T,
  initialValue: T,
) => {
  const route = inject(ActivatedRoute);
  const param$ = route.paramMap.pipe(map(getFn));
  return toSignal(param$, { initialValue });
};

export const getRouteData = <T>(
  getFn: (data: Data, index?: number) => T,
  initialValue: T,
) => {
  const route = inject(ActivatedRoute);
  const data$ = route.data.pipe(map(getFn));
  return toSignal(data$, { initialValue });
};
