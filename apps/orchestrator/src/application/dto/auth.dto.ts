import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiTags('Credenciais')
export class AuthDto {
  @ApiProperty({
    description: 'Username',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

@ApiTags('Token')
export class AuthOutputDto {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNT'
  })
  readonly access_token: string;
}