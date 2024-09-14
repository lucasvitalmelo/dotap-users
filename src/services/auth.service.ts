import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findUser(email)

    const isMatch = await compare(password, user.password)

    if (isMatch) {
      const payload = { user: user.name, email };

      const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '5m', subject: user.id })

      const refreshToken = await this.jwtService.signAsync({}, { expiresIn: '7d', subject: user.id, })

      return { accessToken, refreshToken }
    }
    throw new UnauthorizedException();
  }


  async verifyToken(token: string) {
    if (!token) {
      throw new NotFoundException('user not found');
    }
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('invalid signature');
      }
      if (error.name === 'TokenExpiredError') {
      }
      throw new UnauthorizedException(error.name);
    }
  }
}
