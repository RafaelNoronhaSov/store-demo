import { Module } from '@nestjs/common';
import { AppController } from '@orchestrator/application/app.controller';
import { InfraModule } from '@orchestrator/infra/infra.module';
import { PackingClientController } from '@orchestrator/application/clients/packing.client.controller';

@Module({
  imports: [InfraModule],
  controllers: [AppController, PackingClientController],
})
export class AppModule {}
