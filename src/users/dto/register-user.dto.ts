import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
