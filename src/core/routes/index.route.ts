import { Router } from 'express';

const indexRoutes = Router();

indexRoutes.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome!',
  });
});

export default indexRoutes;
