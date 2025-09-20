import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Token inválido');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: 'CHAVE-SECRETA' });
      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
