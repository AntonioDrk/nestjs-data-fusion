import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        createdAt: true,
        email: true,
        id: true,
        updatedAt: true,
      },
    });
    // Return the payload to submit something as being validated
    // You can attach here multiple properties to show in the req object (req.user)
    return user;
  }
}