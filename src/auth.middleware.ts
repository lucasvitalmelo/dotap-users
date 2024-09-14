import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthMiddleware {
  constructor(
    private authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.authService.verifyToken(req.body.token)
    next()
  }
}
