import { PlatformPort, PlatformPortOptions, StateGetter } from '@shared/core';

export class PlatformPortStub implements PlatformPort {
  isServer: boolean;
  isBrowser: boolean;
  private isSmallScreenValue: boolean;

  constructor(options: PlatformPortOptions = {}) {
    this.isServer = options.isServer ?? false;
    this.isBrowser = options.isBrowser ?? !this.isServer;
    this.isSmallScreenValue = options.isSmallScreen ?? false;
  }

  readonly isSmallScreen: StateGetter<boolean> = () => this.isSmallScreenValue;

  setIsServer(isServer: boolean) {
    this.isServer = isServer;
  }

  setIsBrowser(isBrowser: boolean) {
    this.isBrowser = isBrowser;
  }

  setIsSmallScreen(isSmallScreen: boolean) {
    this.isSmallScreenValue = isSmallScreen;
  }
}
