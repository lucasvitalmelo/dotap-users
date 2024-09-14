import { Body, Controller, Post } from "@nestjs/common";

import { ConflictException } from "@nestjs/common";
import { hash } from "bcryptjs";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "src/services/auth.service";
import { z } from "zod";


const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  token: z.string()
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('users')
export class CreateUserController {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,

  ) { }

  @Post()
  async createUser(@Body() body: CreateUserBodySchema) {
    const { name, email, password, token } = createUserBodySchema.parse(body)

    this.authService.verifyToken(token)

    const findEmail = await this.prisma.user.findUnique({ where: { email: email } })

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