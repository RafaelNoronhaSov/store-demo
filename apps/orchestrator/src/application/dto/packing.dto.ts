import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';

export class PackingDimensionsDto {
  @ApiPropertyOptional({
    description: 'Altura do produto',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  altura: number;

  @ApiPropertyOptional({
    description: 'Largura do produto',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  largura: number;

  @ApiPropertyOptional({
    description: 'Comprimento do produto',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  comprimento: number;
}

export class PackingProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  produto_id: string;

  @ApiProperty({
    description: 'Dimensões do produto',
    example: {
      altura: 10,
      largura: 10,
      comprimento: 10,
    },
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PackingDimensionsDto)
  dimensoes: PackingDimensionsDto;
}

export class PackingItemDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pedido_id: number;

  @ApiProperty({
    description: 'Produtos do pedido',
    example: [
      {
        produto_id: '1',
        dimensoes: {
          altura: 10,
          largura: 10,
          comprimento: 10,
        },
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PackingProductDto)
  produtos: PackingProductDto[];
}

@ApiTags('packing')
export class PackingDto {
  @ApiProperty({
    description: 'Pedidos',
    example: [
      {
        pedido_id: 1,
        produtos: [
          {
            produto_id: '1',
            dimensoes: {
              altura: 10,
              largura: 10,
              comprimento: 10,
            },
          },
        ],
      },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PackingItemDto)
  @ArrayMinSize(1)
  pedidos: PackingItemDto[];
}
