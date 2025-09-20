export interface PackingDimensions {
  altura: number;
  largura: number;
  comprimento: number;
}

export interface PackingProduct {
  produtoId: string;
  dimensoes: PackingDimensions;
}

export interface PackingItem {
  pedidoId: number;
  produtos: PackingProduct[];
}

export interface PackingRequest {
  pedidos: PackingItem[];
}

export interface PackingOutputItemCaixa {
  caixaId: string | null;
  produtos: string[];
  observacao?: string;
}

export interface PackingOutputItem {
  pedidoId: number;
  caixas: PackingOutputItemCaixa[];
}

export interface PackingResponse {
  pedidos: PackingOutputItem[];
}

export interface Package {
  id: string;
  dimensoes: PackingDimensions;
  volume: number;
}

export interface OpenedPackage {
  packageType: Package;
  produtos: PackingProduct[];
  volumeRestante: number;
}