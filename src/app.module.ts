import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

import { CreateUserController } from './controller/create-user.controller';
import { AuthUserController } from './controller/auth-user.controller';


import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
  })],
  controllers: [CreateUserController, AuthUserController,],
  providers: [PrismaService, AuthService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(CreateUserController)
  }
}
