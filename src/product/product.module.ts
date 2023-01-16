import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [CacheModule.register()],
  controllers: [ProductController],
  providers: [ProductService,  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },],
  exports: [ProductService],
})
export class ProductModule {}
