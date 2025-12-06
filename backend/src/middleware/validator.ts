import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateSearchQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query, accountEmail, folder, category } = req.body;

  if (!query && !accountEmail && !folder && !category) {
    throw new AppError('At least one search parameter is required', 400);
  }

  next();
};

export const validateEmailId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { emailId } = req.params;

  if (!emailId || emailId.trim() === '') {
    throw new AppError('Valid email ID is required', 400);
  }

  next();
};

export const validateAccountEmail = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;

  if (!email || !email.includes('@')) {
    throw new AppError('Valid email address is required', 400);
  }

  next();
};
