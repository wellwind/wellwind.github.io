export interface AnalyticsView {
  name: string;
}

export interface AnalyticsPage {
  id: string;
  url: string;
  title?: string;
}

export type AnalyticsEventAttributes = Record<string, unknown>;

export interface AnalyticsSpan {
  setAttribute(name: string, value: unknown): void;
  end(): void;
}

export interface AnalyticsTracer {
  startSpan(name: string, attributes?: AnalyticsEventAttributes): AnalyticsSpan;
}

export interface AnalyticsPort {
  readonly isAvailable: boolean;
  pushEvent(eventName: string, attributes?: AnalyticsEventAttributes): void;
  setView(view: AnalyticsView): void;
  getView(): AnalyticsView | null;
  setPage(page: AnalyticsPage): void;
  getTracer(instrumentation: string): AnalyticsTracer | null;
}

export const createNoopAnalyticsPort = (): AnalyticsPort => ({
  isAvailable: false,
  pushEvent: () => undefined,
  setView: () => undefined,
  getView: () => null,
  setPage: () => undefined,
  getTracer: () => null,
});
