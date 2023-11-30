import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
