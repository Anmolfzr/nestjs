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
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  ProductResponseDto,
  UpdateProductDto,
} from 'src/dtos/product.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @ApiOperation({ description: 'sammy side' })
  /// Response Documentation
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: [
        {
          id: 'c520361a-8e76-4564-b0eb-737246fd922b',
          name: 'puma',
          price: 7500,
          isDeleted: false,
        },
        {
          id: 'aa50e9ae-246b-4955-8fa9-17218a5db945',
          name: 'adidas',
          price: 2500,
          isDeleted: true,
        },
      ],
    },
  })
  // testing
  @ApiResponse({
    description: 'Unauthorized Request',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @Get('all')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ description: 'sammy side idsss' })
  @ApiQuery({
    name: 'ids',
    description: 'collection of uuids. separated by comma,',
    type: 'string[]',
    required: true,
    example: {
      url: 'localhost:3000/product?ids=30577a01-f7ad-4fb2-b29e-da5004e3a92f,9cde6cb5-f14f-4966-875c-6801e09c0b8e',
    },
  })
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: [
        {
          id: 'c520361a-8e76-4564-b0eb-737246fd922b',
          name: 'puma',
          price: 7500,
          isDeleted: false,
        },
        {
          id: 'aa50e9ae-246b-4955-8fa9-17218a5db945',
          name: 'adidas',
          price: 2500,
          isDeleted: true,
        },
      ],
    },
  })
  // testing
  @ApiResponse({
    description: 'Unauthorized Request',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
  @ApiResponse({
    description: 'Internal server error',
    schema: {
      example: [
        {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      ],
    },
  })
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

  @ApiOperation({ description: 'sammy side' })
  @ApiBody({
    type: UpdateProductDto,
    description:
      'The Description for the Post Body. Please look into the DTO. You will see the @ApiOptionalProperty used to define the Schema.',
    examples: {
      a: {
        summary: 'Create Product',
        description: 'Description for when an create body is used',
        value: { name: 'test', price: 1000 } as CreateProductDto,
      },
      b: {
        summary: 'Update Product',
        description: 'update description',
        value: {
          name: 'test',
          price: 1000,
          id: 'fa0259ab-f2c0-4bfa-806b-a9179eb51962',
        } as UpdateProductDto,
      },
    },
  })
  /// Response Documentation
  @ApiOkResponse({
    description: 'Success Response',
    schema: {
      example: {
        id: 'fa0259ab-f2c0-4bfa-806b-a9179eb51962',
        price: 1000,
        name: 'test',
        isDeleted: false,
      },
      // For instructions on how to set a Schema, please refer to https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object-examples
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request Response',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad request',
      },
    },
  })
  @ApiResponse({
    description: 'Unauthorized Request',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    description: 'One can also provided a Status-Code directly, as seen here',
    schema: {
      example: {
        statusCode: 500,
        message: 'APPLICATION_ERROR',
        error: 'Application Error',
      },
    },
  })
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
