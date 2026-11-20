import { Router } from 'express';

const notFoundRoute = Router();

notFoundRoute.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route '${req.path}' is not found`,
  });
});

export default notFoundRoute;
