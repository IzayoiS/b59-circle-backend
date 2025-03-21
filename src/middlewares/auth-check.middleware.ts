import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authCheck(req: Request, res: Response, next: NextFunction) {
  /* #swagger.security = [{
            "bearerAuth": []
    }] */

  let token = req.headers['authorization'] || '';

  if (token.split(' ').length > 1) {
    token = token.split(' ')[1];
  }

  const jwtsecret = process.env.JWT_SECRET || '';
  const user = jwt.verify(token, jwtsecret);

  if (!user) {
    res.status(401).json({
      message: 'Unauthorized',
    });
    return;
  }
  (req as any).user = user;

  next();
}
