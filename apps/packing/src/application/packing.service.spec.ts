import { Test, TestingModule } from '@nestjs/testing';
import { PackingService } from './packing.service';
import {
  PackingRequest,
} from 'common/common/interfaces/packing.interface';

jest.mock('@packing/application/utils/sizes', () => ({
  AVAIALABLE_PACKAGE_SIZES: [
    {
      id: 'Caixa P',
      dimensoes: { altura: 10, largura: 20, comprimento: 30 },
      volume: 6000,
    },
    {
      id: 'Caixa M',
      dimensoes: { altura: 30, largura: 40, comprimento: 50 },
      volume: 60000,
    },
    {
      id: 'Caixa G',
      dimensoes: { altura: 50, largura: 80, comprimento: 100 },
      volume: 400000,
    },
  ].sort((a, b) => a.volume - b.volume),
}));

describe('PackingService', () => {
  let service: PackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackingService],
    }).compile();

    service = module.get<PackingService>(PackingService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  it('deve empacotar múltiplos produtos pequenos em uma única caixa pequena', () => {
    const request: PackingRequest = {
      pedidos: [
        {
          pedidoId: 1,
          produtos: [
            {
              produtoId: 'PROD1',
              dimensoes: { altura: 5, largura: 10, comprimento: 15 },
            },
            {
              produtoId: 'PROD2',
              dimensoes: { altura: 5, largura: 10, comprimento: 15 },
            },
          ],
        },
      ],
    };

    const result = service.pack(request);

    expect(result.pedidos).toHaveLength(1);
    expect(result.pedidos[0].caixas).toHaveLength(1);
    expect(result.pedidos[0].caixas[0].caixaId).toBe('Caixa P');
    expect(result.pedidos[0].caixas[0].produtos).toHaveLength(2);
    expect(result.pedidos[0].caixas[0].produtos).toContain('PROD1');
    expect(result.pedidos[0].caixas[0].produtos).toContain('PROD2');
  });

  it('deve retornar um produto como não embalado se ele for grande demais', () => {
    const request: PackingRequest = {
      pedidos: [
        {
          pedidoId: 2,
          produtos: [
            {
              produtoId: 'GIGANTE',
              dimensoes: { altura: 101, largura: 81, comprimento: 51 },
            },
          ],
        },
      ],
    };

    const result = service.pack(request);

    expect(result.pedidos).toHaveLength(1);
    expect(result.pedidos[0].caixas).toHaveLength(1);
    expect(result.pedidos[0].caixas[0].caixaId).toBeNull();
    expect(result.pedidos[0].caixas[0].produtos).toContain('GIGANTE');
    expect(result.pedidos[0].caixas[0].observacao).toBeDefined();
  });

  it('deve usar múltiplas caixas se os produtos não couberem em uma só', () => {
    const request: PackingRequest = {
      pedidos: [
        {
          pedidoId: 3,
          produtos: [
            {
              produtoId: 'GRANDE',
              dimensoes: { altura: 30, largura: 30, comprimento: 30 },
            },
            {
              produtoId: 'PEQUENO',
              dimensoes: { altura: 5, largura: 5, comprimento: 5 },
            },
          ],
        },
      ],
    };

    const result = service.pack(request);
    expect(result.pedidos[0].caixas).toHaveLength(1);

    const caixa = result.pedidos[0].caixas[0];
    expect(caixa.caixaId).toBe('Caixa M');
    expect(caixa.produtos).toContain('GRANDE');
    expect(caixa.produtos).toContain('PEQUENO');
  });


  it('deve empacotar um produto que só cabe na caixa após rotação', () => {
    const request: PackingRequest = {
      pedidos: [
        {
          pedidoId: 4,
          produtos: [
            {
              produtoId: 'PROD_ROTACAO',
              dimensoes: { altura: 25, largura: 35, comprimento: 5 },
            },
          ],
        },
      ],
    };

    const result = service.pack(request);
    expect(result.pedidos[0].caixas[0].caixaId).toBe('Caixa M');
    expect(result.pedidos[0].caixas[0].produtos).toContain('PROD_ROTACAO');
  });

  it('deve retornar um array de caixas vazio para um pedido sem produtos', () => {
    const request: PackingRequest = {
      pedidos: [{ pedidoId: 5, produtos: [] }],
    };

    const result = service.pack(request);
    expect(result.pedidos[0].caixas).toHaveLength(0);
  });

  it('deve retornar um array de pedidos vazio se a requisição não tiver pedidos', () => {
    const request: PackingRequest = {
      pedidos: [],
    };
    const result = service.pack(request);
    expect(result.pedidos).toHaveLength(0);
  });

  it('deve processar múltiplos pedidos corretamente na mesma chamada', () => {
    const request: PackingRequest = {
      pedidos: [
        {
          pedidoId: 10,
          produtos: [
            {
              produtoId: 'P10',
              dimensoes: { altura: 1, largura: 1, comprimento: 1 },
            },
          ],
        },
        {
          pedidoId: 11,
          produtos: [
            {
              produtoId: 'P11_GIGANTE',
              dimensoes: { altura: 999, largura: 999, comprimento: 999 },
            },
          ],
        },
      ],
    };

    const result = service.pack(request);
    expect(result.pedidos).toHaveLength(2);

    const pedido10 = result.pedidos.find((p) => p.pedidoId === 10);
    expect(pedido10).toBeDefined();
    expect(pedido10!.caixas).toHaveLength(1);
    expect(pedido10!.caixas[0].caixaId).toBe('Caixa P');
    expect(pedido10!.caixas[0].produtos).toContain('P10');

    const pedido11 = result.pedidos.find((p) => p.pedidoId === 11);
    expect(pedido11).toBeDefined();
    expect(pedido11!.caixas).toHaveLength(1);
    expect(pedido11!.caixas[0].caixaId).toBeNull();
    expect(pedido11!.caixas[0].produtos).toContain('P11_GIGANTE');
  });
});
