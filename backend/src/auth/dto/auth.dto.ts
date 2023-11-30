import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/** Defines what checks are performed on the body of the request (for sign-in) through the ValidationPipe */
export class SigninDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
