import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
dotenv.config();

import app from '../backend/src/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}