import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('signin')
  signin(@Body() dto: SigninDto) {
    console.log({ dto });
    return this.authService.signin();
  }

  @HttpCode(200)
  @Post('signout')
  signout() {
    return this.authService.signout();
  }
}
