import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware.js';
import { middleware } from './middlewares/index.js';
import { COOKIE_SECRET } from './constants.js';
import cookieParser from 'cookie-parser';
import createRouter from './router.js';
import createCoreContainer, { type CoreContainer } from './bootstrap.js';
import createAppContainer, { type AppContainer } from '../bootstrap.js';
import { dbVirtualOffice } from './index.js';

export type MainContainer = CoreContainer & AppContainer;

const app = express();
const coreContainer = createCoreContainer(dbVirtualOffice);
const appContainer = createAppContainer(
  dbVirtualOffice,
  coreContainer.authModule.service,
);
const mainContainer: MainContainer = { ...coreContainer, ...appContainer };
const router = createRouter(mainContainer);

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors());
app.use(compression());

if (COOKIE_SECRET) app.use(cookieParser(COOKIE_SECRET));

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  ),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware);
app.use(router);
app.use(errorHandler);

export default app;
