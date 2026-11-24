import { Router } from 'express';

const notFoundRoute = Router();

notFoundRoute.use((_req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route not found`,
    details: {
      route: '${req.path}',
    },
  });
});

export default notFoundRoute;
