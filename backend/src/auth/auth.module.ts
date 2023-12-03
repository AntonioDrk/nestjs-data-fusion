import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
