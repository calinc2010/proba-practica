import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ScraperService } from 'src/scraper/scraper.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeProduct } from 'src/exchange-rate-products/exchange-rate-product.entity';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ExchangeProduct]), AuthModule],
  providers: [ProductsService, ScraperService, ExchangeRateService],
  controllers: [ProductsController],
})
export class ProductsModule {}
