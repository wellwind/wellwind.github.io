import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  isSmallScreen$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small
  ]).pipe(
    map(value => !!value.matches)
  );

  isSmallAndMediumScreen$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium
  ]).pipe(
    map(value => !!value.matches)
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private breakpointObserver: BreakpointObserver) {
  }
}
