import {
  AnalyticsEventAttributes,
  AnalyticsPage,
  AnalyticsPort,
  AnalyticsTracer,
  AnalyticsView,
} from '@shared/core';

export interface LoggedAnalyticsEvent {
  name: string;
  attributes?: AnalyticsEventAttributes;
}

const noopTracer: AnalyticsTracer = {
  startSpan: () => ({
    setAttribute: () => undefined,
    end: () => undefined,
  }),
};

export class AnalyticsPortSpy implements AnalyticsPort {
  readonly isAvailable = true;
  readonly events: LoggedAnalyticsEvent[] = [];
  readonly views: AnalyticsView[] = [];
  readonly pages: AnalyticsPage[] = [];

  private currentView: AnalyticsView | null = null;

  pushEvent(name: string, attributes?: AnalyticsEventAttributes): void {
    this.events.push({ name, attributes });
  }

  setView(view: AnalyticsView): void {
    this.currentView = view;
    this.views.push(view);
  }

  getView(): AnalyticsView | null {
    return this.currentView;
  }

  setPage(page: AnalyticsPage): void {
    this.pages.push(page);
  }

  getTracer(): AnalyticsTracer | null {
    return noopTracer;
  }
}
