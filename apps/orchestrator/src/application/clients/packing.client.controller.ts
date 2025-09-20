import { Controller, Post, Body, Inject, Logger, UseGuards } from '@nestjs/common';
import { type ClientGrpc, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PackingDto } from '@orchestrator/application/dto/packing.dto';
import { PackingOutputDto } from '@orchestrator/application/dto/packing.output.dto';
import { PackingRequest, PackingResponse } from 'common/common/interfaces/packing.interface';
import { PackingMapper } from '../utils/packing.mapper';
import { AuthGuard } from '@orchestrator/infra/guards/auth.guard';

interface PackingService {
  IssuePacking(request: PackingRequest): Observable<PackingResponse>;
}

@ApiTags('Empacotamento')
@UseGuards(AuthGuard)
@Controller('empacotamento')
export class PackingClientController {
  private readonly logger = new Logger(PackingClientController.name);
  private packingService: PackingService;

  constructor(
    @Inject('PACKING') private readonly packingClient: ClientGrpc
  ) {}

  /**
   * Inicializa o serviço de empacotamento com a instância do client gRPC.
   * Este método é chamado automaticamente quando o módulo é inicializado.
   */
  onModuleInit() {
    this.packingService = this.packingClient.getService<PackingService>('PackingService');
  }

  @Post('enviar')
  @ApiOperation({ summary: 'Solicitar empacotamento de pedidos' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: PackingDto })
  @ApiResponse({ status: 201, description: 'Pedido enviado com sucesso', type: PackingOutputDto })
  @ApiResponse({ status: 401, description: 'Acesso negado' })
  @ApiResponse({ status: 400, description: 'Erro de validação do pedido' })
  @ApiResponse({ status: 500, description: 'Erro interno ao processar pedido' })
  /**
   * Envia um pedido para o serviço de empacotamento.
   * @param body Pedido a ser enviado para o serviço de empacotamento.
   * @returns Uma promessa com o resultado do empacotamento do pedido.
   */
  async sendForPacking(@Body() body: PackingDto): Promise<PackingOutputDto> {
    const request = PackingMapper.toGrpcRequest(body);

    const response: PackingResponse = await firstValueFrom(
      this.packingService.IssuePacking(request).pipe(
        catchError(err => {
          this.logger.error('Erro ao enviar para empacotamento', err.stack);
          return throwError(() => new RpcException({
            message: 'Erro ao enviar para empacotamento',
            details: err.message,
          }));
        })
      )
    );

    return PackingMapper.fromGrpcResponseToDto(response);
  }
}
