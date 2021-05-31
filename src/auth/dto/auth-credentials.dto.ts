import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @MinLength(8)
  @MaxLength(24)
  @IsString()
  username: string;

  @MinLength(8)
  @MaxLength(32)
  @IsString()
  password: string;
}
