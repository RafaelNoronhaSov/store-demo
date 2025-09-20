import { PackingDto } from '@orchestrator/application/dto/packing.dto';
import { PackingOutputDto } from '@orchestrator/application/dto/packing.output.dto';
import {
  PackingRequest,
  PackingResponse,
} from 'common/common/interfaces/packing.interface';

/**
 * Classe estática responsável por mapear os objetos de transferência de dados (DTOs)
 * para os formatos de requisição/resposta do serviço gRPC e vice-versa.
 */
export class PackingMapper {
  /**
   * Converte o DTO de entrada da API para o formato de requisição gRPC.
   * @param dto - O objeto PackingDto recebido no controller RESTful.
   * @returns Um objeto PackingRequest pronto para ser enviado ao serviço gRPC.
   */
  public static toGrpcRequest(dto: PackingDto): PackingRequest {
    return {
      pedidos: dto.pedidos.map((p) => ({
        pedidoId: Number(p.pedido_id),
        produtos: p.produtos.map((prod) => ({
          produtoId: String(prod.produto_id),
          dimensoes: {
            altura: Number(prod.dimensoes.altura),
            largura: Number(prod.dimensoes.largura),
            comprimento: Number(prod.dimensoes.comprimento),
          },
        })),
      })),
    };
  }

  /**
   * Converte a resposta do serviço gRPC para o DTO de saída da API.
   * @param response - O objeto PackingResponse recebido do serviço gRPC.
   * @returns Um objeto PackingOutputDto pronto para ser retornado pela API.
   */
  public static fromGrpcResponseToDto(
    response: PackingResponse,
  ): PackingOutputDto {
    return {
      pedidos: response.pedidos.map((pedido) => ({
        pedido_id: pedido.pedidoId,
        caixas: pedido.caixas.map((caixa) => ({
          caixa_id: caixa.caixaId || null,
          produtos: caixa.produtos,
          observacao: caixa.observacao,
        })),
      })),
    };
  }
}
