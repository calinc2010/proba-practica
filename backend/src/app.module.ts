import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './products/product.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './invoice/invoice.module';
import { ExchangeProduct } from './exchange-rate-products/exchange-rate-product.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://neondb_owner:npg_5QtjnXZ8Dwvc@ep-frosty-bird-aliq8e1w-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      ssl: true,
      entities: [Product, ExchangeProduct],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    ProductsModule,
    InvoiceModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
