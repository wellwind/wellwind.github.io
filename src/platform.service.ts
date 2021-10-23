import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  get isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }
}
