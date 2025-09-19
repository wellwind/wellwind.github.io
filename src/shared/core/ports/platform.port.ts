export type StateGetter<T> = () => T;

export interface PlatformPort {
  readonly isServer: boolean;
  readonly isBrowser: boolean;
  readonly isSmallScreen: StateGetter<boolean>;
}

export interface PlatformPortOptions {
  isServer?: boolean;
  isBrowser?: boolean;
  isSmallScreen?: boolean;
}

export const createPlatformPort = (
  options: PlatformPortOptions = {},
): PlatformPort => {
  const isServer = options.isServer ?? false;
  const isBrowser = options.isBrowser ?? !isServer;
  const isSmallScreenValue = options.isSmallScreen ?? false;

  return {
    isServer,
    isBrowser,
    isSmallScreen: () => isSmallScreenValue,
  };
};
