import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { ProductResponseDto } from 'src/dtos/product.dto';
import { productData } from 'src/mockdata/products-data';

interface Product {
  price: number;
  name: string;
}

interface UpdateProduct {
  price?: number;
  name?: string;
  isDeleted?: boolean;
}

@Injectable()
export class ProductService {
  constructor() {}

  getAllProducts(): ProductResponseDto[] {
    try {
      const products = productData.map(
        (product) => new ProductResponseDto(product),
      );
      if (products) {
        return products;
      } else {
        throw new NotFoundException();
      }
    } catch {
      throw new HttpException('Internal Server Error', 400);
    }
  }

  getProductsByIds(ids: string[]) {
    try {
      const filteredProductData = productData.filter((product) =>
        ids.includes(product.id),
      );
      if (filteredProductData) {
        return filteredProductData;
      } else {
        throw new NotFoundException();
      }
    } catch {
      throw new HttpException('Internal Server Error', 400);
    }
  }

  getProductById(id: string): ProductResponseDto {
    try {
      const findProduct = productData.find((product) => product.id === id);
      const product = new ProductResponseDto(findProduct);
      if (product) {
        return product;
      } else {
        throw new NotFoundException();
      }
    } catch {
      throw new HttpException('Internal Server Error', 400);
    }
  }

  upsertProduct(data, isDeleted): ProductResponseDto {
    try {
      if (data.id) {
        const productIndex = productData.findIndex(
          (product) => product.id === data.id,
        );
        if (productIndex !== -1) {
          const updateProduct = this.updateProduct(
            productIndex,
            data,
            isDeleted,
          );
          return updateProduct;
        }
      } else if (data.price && data.name) {
        return this.createProduct(data);
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new HttpException('Internal Server Error', 400);
    }
  }

  updateProduct(productIndex: number, data: ProductResponseDto, isDeleted) {
    data.isDeleted = isDeleted;
    productData[productIndex] = {
      ...productData[productIndex],
      ...data,
      updated_at: new Date(),
    };
    const product = new ProductResponseDto(productData[productIndex]);
    return product;
  }

  createProduct(data: ProductResponseDto) {
    const newProduct = this.createObject(data.price, data.name);
    productData.push(newProduct);
    const product = new ProductResponseDto(newProduct);
    return product;
  }

  createObject(price, name) {
    const newProduct = {
      id: uuid(),
      price,
      name,
      isDeleted: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    return newProduct;
  }
}
