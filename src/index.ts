import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { ImagesRoutes } from './images/images.routes.config';
import debug from 'debug';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: any = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON
app.use(bodyparser.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are configuring the expressWinston logging middleware,
// which will automatically log all HTTP requests handled by Express.js
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new ImagesRoutes(app));

// here we are configuring the expressWinston error-logging middleware,
// which doesn't *handle* errors per se, but does *log* them
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.colorize(), winston.format.json())
  })
);

server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
  console.log(`Server running at http://localhost:${port}`);
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});
