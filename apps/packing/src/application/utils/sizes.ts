import { Package } from "common/common/interfaces/packing.interface";

export const AVAIALABLE_PACKAGE_SIZES: Package[] = [
  {
    id: 'Caixa 1',
    dimensoes: { altura: 30, largura: 40, comprimento: 80 },
    volume: 30 * 40 * 80,
  },
  {
    id: 'Caixa 2',
    dimensoes: { altura: 50, largura: 50, comprimento: 40 },
    volume: 50 * 50 * 40,
  },
  {
    id: 'Caixa 3',
    dimensoes: { altura: 50, largura: 80, comprimento: 60 },
    volume: 50 * 80 * 60,
  },
].sort((a, b) => a.volume - b.volume);