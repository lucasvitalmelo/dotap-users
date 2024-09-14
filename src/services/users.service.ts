import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } })

    if (user) {
      return user
    }
    throw new UnauthorizedException();
  }

  async createUser(name: string, email: string, password: string) {
    const findEmail = await this.findUser(email)

    if (findEmail) {
      throw new ConflictException(
        'user with this email already exists'
      )
    }

    const encryptedPassword = await hash(password, 8)

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
        permissions: []
      }
    })
  }
}