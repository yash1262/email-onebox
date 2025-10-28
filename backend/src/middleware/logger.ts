import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.info(
      `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
