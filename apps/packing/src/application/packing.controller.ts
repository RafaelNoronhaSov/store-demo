import { Controller } from "@nestjs/common";
import { PackingService } from "@packing/application/packing.service";
import { type PackingResponse, type PackingRequest } from "common/common/interfaces/packing.interface";
import { GrpcMethod } from "@nestjs/microservices";


@Controller('packing')
export class PackingController {
  constructor(
    private readonly packingService: PackingService
  ) {}

  @GrpcMethod('PackingService', 'IssuePacking')
  /**
   * Processa uma lista de pedidos e retorna as caixas necessárias para embalar todos os produtos.
   * @param message Informações dos pedidos a ser processados.
   * @returns Informações das caixas necessárias para embalar os produtos.
   */
  IssuePacking(message: PackingRequest): PackingResponse {
    const result: PackingResponse = this.packingService.pack(message);
    return result;
  }
}