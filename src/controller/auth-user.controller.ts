import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";

import { AuthService } from "src/services/auth.service";
import { z } from "zod";


const authUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string()
})
type AuthUserBodySchema = z.infer<typeof authUserBodySchema>

@Controller('auth')
export class AuthUserController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Post()
  async authUser(@Body() body: AuthUserBodySchema, @Res() response: Response) {
    const { email, password } = authUserBodySchema.parse(body)

    const { refreshToken, accessToken } = await this.authService.signIn(email, password)

    // response.cookie('refresh_token', refreshToken, {})
    return { accessToken }
  }
}