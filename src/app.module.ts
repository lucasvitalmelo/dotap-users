import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserController } from './prisma/controller/create-user.controller';

@Module({
  imports: [],
  controllers: [CreateUserController],
  providers: [PrismaService],
})
export class AppModule { }
