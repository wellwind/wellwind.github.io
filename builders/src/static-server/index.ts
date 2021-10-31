import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

import * as connect from 'connect';
import { BehaviorSubject, Observable } from 'rxjs';
import * as serveStatic from 'serve-static';
import * as cors from 'cors';

interface Options extends JsonObject {
  path: string;
  port: number;
}

export default createBuilder(staticServer);

function staticServer(options: Options, context: BuilderContext): Observable<BuilderOutput> {
  const fileDir = options.path;
  const port = options.port;

  connect()
    .use(cors())
    .use(serveStatic(fileDir))
    .listen(port, () => context.logger.info(`💻 Server running on ${port}...`));

  return new BehaviorSubject({ success: true });
}
