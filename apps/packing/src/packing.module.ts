import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PackingController } from './application/packing.controller';
import { PackingService } from './application/packing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  providers: [PackingService],
  controllers: [PackingController]
})
export class PackingModule {}
