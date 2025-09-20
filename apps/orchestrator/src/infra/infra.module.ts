import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Env, envSchema } from './config/config.schema';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

/**
 * Modulo de Infraestrutura.
 * Aqui geralmente gosto de incluir todas as dependências de configuração e infraestrutura do serviço
 * dentro do diretório infra também pode ser criado outros arquivos para lidar com services e wrappers
 * que são ativados no start do microserviço.
 */
@Global() // Gosto de usar o decorator Global para indicar que esse modulo é pervasivo a todos os modulos do app
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          console.error('Erro ao validar variáveis de ambiente:', result.error);
          throw new Error('Variáveis de ambiente inválidas');
        }
        return result.data;
      },
    }),
    ClientsModule.registerAsync([ // Configuração dinâmica de todos os serviços clients.
      {  // É possível futuramente criar um arquivo de providers para isso, quando aumentar a quantidade de clients
        name: 'PACKING', // Nome simples e memóravel referente ao domínio da regra de negócio
        useFactory: async (configService: ConfigService<Env>) => ({
          transport: Transport.GRPC, // Escolhi aqui o procolo gRPC como stub de comunicação para o serviço interno.
          options: {
            url: `${configService.get('PACKING_HOST')}:${configService.get('PACKING_PORT')}`,
            package: 'packing',
            protoPath: 'libs/common/src/proto/packing.proto',
          }
        }),
        inject: [ConfigService]
      }
    ]),
    JwtModule.register({ // Apenas um stub, pois prefiro um serviço a parte para gerenciar acesso e autenticação de usuário comum ao mesmo ecossistema
      secret: 'CHAVE-SECRETA',
      signOptions: { expiresIn: '1h' }, // Access tokens devem ser sempre short-lived, refresh tokens long-lived
    }),
    // ObservabilityModule
    // LoggingModule
    // CommonModule
  ],
  exports: [ClientsModule, ConfigModule, JwtModule ],
})
export class InfraModule {}
