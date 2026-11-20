import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import router from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { middleware } from './middlewares/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
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
