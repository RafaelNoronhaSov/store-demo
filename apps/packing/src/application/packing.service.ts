import { Injectable } from '@nestjs/common';
import {
  OpenedPackage,
  Package,
  PackingDimensions,
  PackingItem,
  PackingOutputItem,
  PackingOutputItemCaixa,
  PackingProduct,
  PackingRequest,
  PackingResponse,
} from 'common/common/interfaces/packing.interface';
import { AVAIALABLE_PACKAGE_SIZES } from '@packing/application/utils/sizes';

@Injectable()
export class PackingService {
  /**
   * Processa uma lista de pedidos e retorna as caixas necessárias para embalar todos os produtos.
   * @param request Informações dos pedidos a ser processados.
   * @returns Informações das caixas necessárias para embalar os produtos.
   */
  public pack(request: PackingRequest): PackingResponse {
    const resultadoPedidos = request.pedidos.map((pedido) =>
      this.packSingleOrder(pedido),
    );

    return {
      pedidos: resultadoPedidos,
    };
  }

  /**
   * Processa um pedido e retorna as caixas necessárias para embalar todos os produtos.
   * @param pedido Informações do pedido a ser processado.
   * @returns Informações das caixas necessárias para embalar os produtos.
   */
  private packSingleOrder(pedido: PackingItem): PackingOutputItem {
    let produtosParaEmbalar = [...pedido.produtos].sort(
      (a, b) =>
        this.getProductVolume(b.dimensoes) -
        this.getProductVolume(a.dimensoes),
    );

    const caixasFinais: OpenedPackage[] = [];
    const produtosSemCaixa: PackingProduct[] = [];
    while (produtosParaEmbalar.length > 0) {
      const produtoPrincipal = produtosParaEmbalar.shift()!;

      let melhorCaixaParaAbrir: Package | null = null;
      for (const tipoCaixa of AVAIALABLE_PACKAGE_SIZES) {
        if (this.canProductFitInPackage(produtoPrincipal.dimensoes, tipoCaixa.dimensoes)) {
          melhorCaixaParaAbrir = tipoCaixa;
          break;
        }
      }

      if (!melhorCaixaParaAbrir) {
        produtosSemCaixa.push(produtoPrincipal);
        continue;
      }

      const novaCaixa: OpenedPackage = {
        packageType: melhorCaixaParaAbrir,
        produtos: [produtoPrincipal],
        volumeRestante:
          melhorCaixaParaAbrir.volume -
          this.getProductVolume(produtoPrincipal.dimensoes),
      };

      for (let i = produtosParaEmbalar.length - 1; i >= 0; i--) {
        const produtoAtual = produtosParaEmbalar[i];
        const volumeProduto = this.getProductVolume(produtoAtual.dimensoes);

        if (
          volumeProduto <= novaCaixa.volumeRestante &&
          this.canProductFitInPackage(produtoAtual.dimensoes, novaCaixa.packageType.dimensoes)
        ) {
          novaCaixa.produtos.push(produtoAtual);
          novaCaixa.volumeRestante -= volumeProduto;
          produtosParaEmbalar.splice(i, 1);
        }
      }

      caixasFinais.push(novaCaixa);
    }

    const caixasResultado: PackingOutputItemCaixa[] = caixasFinais.map(
      (caixa) => ({
        caixaId: caixa.packageType.id,
        produtos: caixa.produtos.map((p) => p.produtoId),
      }),
    );

    if (produtosSemCaixa.length > 0) {
      caixasResultado.push({
        caixaId: null,
        produtos: produtosSemCaixa.map((p) => p.produtoId),
        observacao:
          'Estes produtos não couberam em nenhuma das caixas disponíveis.',
      });
    }

    return {
      pedidoId: pedido.pedidoId,
      caixas: caixasResultado,
    };
  }

  /**
   * Retorna o volume de um produto com base nas suas dimensões.
   * @param dimensoes Dimensões do produto.
   * @returns Volume do produto.
   */
  private getProductVolume(dimensoes: PackingDimensions): number {
    return dimensoes.altura * dimensoes.largura * dimensoes.comprimento;
  }

  /**
   * Verifica se um produto pode ser colocado em uma caixa com base nas suas dimensões.
   * @param produtoDimensoes Dimensões do produto.
   * @param caixaDimensoes Dimensões da caixa.
   * @returns booleano indicando se o produto pode ou não ser colocado na caixa.
   */
  private canProductFitInPackage(
    produtoDimensoes: PackingDimensions,
    caixaDimensoes: PackingDimensions,
  ): boolean {
    const p = [
      produtoDimensoes.altura,
      produtoDimensoes.largura,
      produtoDimensoes.comprimento,
    ];
    const c = [
      caixaDimensoes.altura,
      caixaDimensoes.largura,
      caixaDimensoes.comprimento,
    ].sort((a, b) => a - b);

    const rotacoes = [
      [p[0], p[1], p[2]],
      [p[0], p[2], p[1]],
      [p[1], p[0], p[2]],
      [p[1], p[2], p[0]],
      [p[2], p[0], p[1]],
      [p[2], p[1], p[0]],
    ];

    for (const rot of rotacoes) {
      const r = rot.sort((a, b) => a - b);
      if (r[0] <= c[0] && r[1] <= c[1] && r[2] <= c[2]) {
        return true;
      }
    }

    return false;
  }
}
