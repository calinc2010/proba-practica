import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductInput } from 'src/models/create-product-inputs';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';
import { ExchangeProduct } from 'src/exchange-rate-products/exchange-rate-product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ExchangeProduct)
    private exchangeRateProductRepository: Repository<ExchangeProduct>,
    private exchangeRateService: ExchangeRateService,
  ) {}

  // Adaugam produsele care vin de pe site dupa scrape, in baza de date
  async addScrapedProducts(products: CreateProductInput[]) {
    const existingProducts = await this.productRepository.find({
      select: {
        name: true,
      },
    });

    // Verificam produsele care deja exista in baza de date si nu le mai adaugam, adaugam doar produsele noi
    const existingNames = new Set(
      existingProducts.map((product) => product.name?.toLowerCase().trim()),
    );

    const newProducts = products.filter((product) => {
      const name = product.name.toLowerCase().trim();
      return !existingNames.has(name);
    });

    if (newProducts.length === 0) {
      return [];
    }

    return this.productRepository.save(newProducts);
  }

  //Extragerea produselor din baza de date
  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  //Edit product (update)
  async updateProduct(productId: string, product: Partial<Product>) {
    await this.productRepository.update(productId, product);

    return this.productRepository.findOne({
      where: { id: productId },
    });
  }

  //Delete product
  async deleteProduct(productId: string) {
    await this.productRepository.delete(productId);

    return {
      deleted: true,
      productId,
    };
  }

  async convertProductsToRon() {
    const products = await this.productRepository.find();

    const { rate, date } = await this.exchangeRateService.getUsdRonRate();

    const existingExchangeProducts =
      await this.exchangeRateProductRepository.find({
        where: {
          exchangeRateDate: date,
        },
      });

    const existingProductIds = new Set(
      existingExchangeProducts.map((product) => product.originalProductId),
    );

    const exchangeProducts = products
      .filter((product) => !existingProductIds.has(product.id))
      .map((product) => {
        const priceUsd = Number(product.price);
        const priceRon = priceUsd * rate;

        return {
          originalProductId: product.id,
          imageUrl: product.imageUrl ?? '',
          name: product.name ?? '',
          description: product.description ?? '',
          priceUsd: priceUsd.toFixed(2),
          priceRon: priceRon.toFixed(2),
          usdRonRate: rate.toFixed(4),
          exchangeRateDate: date,
        };
      });

    if (exchangeProducts.length === 0) {
      return [];
    }

    return this.exchangeRateProductRepository.save(exchangeProducts);
  }

  async getExchangeProducts() {
    return await this.exchangeRateProductRepository.find();
  }

  //adaugat pentru a facilita testarea :D
  async deleteAllExchangeProducts() {
    return await this.exchangeRateProductRepository.deleteAll();
  }
}
