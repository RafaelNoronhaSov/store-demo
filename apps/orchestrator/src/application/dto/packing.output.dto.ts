import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";

export class PackingOutputItemCaixaDto {
  @ApiPropertyOptional({
    description: 'Box ID',
    example: '1',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly caixa_id?: string | null;

  @ApiProperty({
    description: 'Lista de produtos',
    example: ['1', '2'],
  })
  @IsArray()
  @Type(() => String)
  readonly produtos: string[];

  @ApiPropertyOptional({
    description: 'Observação',
    example: 'Observação',
  })
  @IsString()
  @IsOptional()
  @Type(() => String)
  readonly observacao?: string;
}

export class PackingOutputItemDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  readonly pedido_id: number;

  @ApiProperty({
    description: 'Lista de caixas',
    example: [
      {
        caixa_id: '1',
        produtos: ['1', '2'],
        observacao: 'Observação',
      },
    ],
  })
  @ValidateNested()
  @IsArray()
  @Type(() => PackingOutputItemCaixaDto)
  readonly caixas: PackingOutputItemCaixaDto[];
}

export class PackingOutputDto {
  @ApiProperty({
    description: 'Lista de pedidos',
    example: [
      {
        pedido_id: 1,
        caixas: [
          {
            caixa_id: '1',
            produtos: ['1', '2'],
            observacao: 'Observação',
          },
        ],
      },
    ],
  })
  @ValidateNested()
  @IsArray()
  @Type(() => PackingOutputItemDto)
  readonly pedidos: PackingOutputItemDto[];
}