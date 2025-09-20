import { Controller, Post, Body, UnauthorizedException, UseGuards, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiResponse, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthDto, AuthOutputDto } from './dto/auth.dto';
import { AuthGuard } from '@orchestrator/infra/guards/auth.guard';

@ApiTags('Autenticação')
@Controller()
export class AppController {
  constructor(private readonly jwtService: JwtService) {}

  @ApiResponse({ status: 201, description: 'Token gerado com sucesso.', type: AuthOutputDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiOperation({ summary: 'Fazer login e obter token de acesso' })
  @ApiBody({ description: 'Credenciais para fazer login', type: AuthDto })
  @ApiResponse({ type: AuthOutputDto, description: 'Token de acesso gerado com sucesso.' })
  @Post('auth/login')
  async login(@Body() body: AuthDto): Promise<AuthOutputDto> { // Implementei apenas uma rota simplificada, geralmente prefiro um serviço a parte para isso
    const { username, password } = body;
    if (username !== 'admin' || password !== 'password') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Requisição stub de healthcheck' })
  @ApiOperation({ summary: 'Healthcheck' })
  @Get('healthcheck')
  healthcheck() { // Isso é apenas um stub, geralmente iriamos usar um padrão de heartbeat / prometheus para o monitoring
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}