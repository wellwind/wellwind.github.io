import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import * as cors from 'cors';
import { join } from 'path';

const distFolder = join(process.cwd(), 'dist/blog/browser');
connect()
  .use(cors())
  .use(serveStatic(distFolder))
  .listen(4001, () => console.log('Server running on 4001...'));
