import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly breakpointObserver = inject(BreakpointObserver);

  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  private isSmallScreen$ = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(
      map((value) => !!value.matches),
      shareReplay(1),
    );

  readonly isSmallScreen = toSignal(this.isSmallScreen$);
}
