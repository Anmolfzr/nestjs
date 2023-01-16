import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  Query,
  ParseArrayPipe,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  ProductResponseDto,
} from 'src/dtos/product.dto';

@Controller('product')
@UseInterceptors(CacheInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get()
  findByIds(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
  ) {
    return this.productService.getProductsByIds(ids);
  }

  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id: string): ProductResponseDto {
    return this.productService.getProductById(id);
  }

  @Post()
  upsertProduct(@Body() body) {
    return this.productService.upsertProduct(body, false);
  }

  @Put('delete/:id')
  softDeleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
    body = { id },
  ): ProductResponseDto {
    if (id) {
      return this.productService.upsertProduct(body, true);
    }
  }
}
