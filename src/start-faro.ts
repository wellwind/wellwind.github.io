import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
  url: 'https://faro-collector-prod-ap-southeast-1.grafana.net/collect/7589747939196e0549ee6d33aa985355',
  app: {
    name: 'Fullstack Ladder',
    version: '1.0.0',
    environment: 'production',
  },

  instrumentations: [
    // Mandatory, omits default instrumentations otherwise.
    ...getWebInstrumentations(),

    // Tracing package to get end-to-end visibility for HTTP requests.
    new TracingInstrumentation(),
  ],
});
