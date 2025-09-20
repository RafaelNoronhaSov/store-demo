import { NestFactory } from '@nestjs/core';
import { PackingModule } from './packing.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(PackingModule, {
    transport: Transport.GRPC,
    options: {
      package: 'packing',
      protoPath: 'libs/common/src/proto/packing.proto',
      url: `${process.env.PACKING_HOST || 'localhost'}:${process.env.PACKING_PORT || 50051}`,
      loader: {
        keepCase: true
      }
    },
  });

  // Tive alguns problemas em relação ao objeto nested então tive que aplicar em um certo ponto um pouco de força bruta para resolver isso
  // TODO: Procurar uma solução mais inteligente
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  await app.listen();
}
bootstrap();