import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  async login(payload: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (!user || !(await compare(payload.password, user.passwordHash))) {
      throw new UnauthorizedException("بيانات الدخول غير صحيحة");
    }

    const tokenPayload = { sub: user.id, role: user.role, name: user.name, email: user.email };
    return {
      accessToken: await this.jwt.signAsync(tokenPayload, { secret: this.config.get<string>("JWT_ACCESS_SECRET"), expiresIn: this.config.get<string>("JWT_ACCESS_EXPIRES_IN") ?? "15m" }),
      refreshToken: await this.jwt.signAsync(tokenPayload, { secret: this.config.get<string>("JWT_REFRESH_SECRET"), expiresIn: this.config.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d" }),
      user: { id: user.id, name: user.name, role: user.role, email: user.email }
    };
  }
}
