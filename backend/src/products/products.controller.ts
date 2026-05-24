import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { Product } from './product.entity';
import { Cron } from '@nestjs/schedule';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private scraperService: ScraperService,
    private productsService: ProductsService,
  ) {}

  // Cron-ul care ruleaza in intervalul 12-18 la fiecare ora si face scrape la produse
  // Va fi activ cat timp aplicatia este pornita, nu necesita apelare
  @Cron('0 12-18 * * *')
  async scrapeEveryHourBetween12And18() {
    const consumables = await this.scraperService.loginAndScrape();

    const products = consumables.map((consumable) => ({
      imageUrl: consumable.imageUrl,
      name: consumable.title,
      description: consumable.description,
      price: consumable.price.toString(),
    }));

    await this.productsService.addScrapedProducts(products);
    return {
      statusCode: 200,
      message: 'Produsele au fost salvate cu succes',
    };
  }

  //Login si scrape manual la produse, poate fi declansat manual. enpointul '/products/scrape'
  @Get('scrape')
  async fetchNewProducts() {
    const consumables = await this.scraperService.loginAndScrape();

    const products = consumables.map((consumable) => ({
      imageUrl: consumable.imageUrl,
      name: consumable.title,
      description: consumable.description,
      price: consumable.price.toString(),
    }));

    await this.productsService.addScrapedProducts(products);
    return {
      statusCode: 200,
      message: 'Produsele au fost salvate cu succes',
    };
  }

  // Extrage produsele din baza de date - endpointul este '/products'
  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  //Editare produs - endpointul este '/products/:idProdus'
  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: Partial<Product>,
  ) {
    return await this.productsService.updateProduct(id, product);
  }

  //Adaugat pentru a facilita testarea, sterge toate produsele care au pretul calculat folosind cursul valutar
  // endpointul este '/products/exchange-products'
  @Delete('exchange-products')
  async deleteAllExchangeProducts() {
    return this.productsService.deleteAllExchangeProducts();
  }

  //Stergere produs - endpointul este '/products/:idProdus'
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }

  //Ia toate Produsele de la problema 1, cauta cursul valabil azi si le calculeaza pretul si le salveaza in DB
  @Post('convert-exchange')
  async convertProductsToRon() {
    return await this.productsService.convertProductsToRon();
  }

  //Extrage din DB toate produsele din tabelul exchange_products si le returneaza catre frontend
  // endpoint-ul este '/products/exchange-products'
  @Get('exchange-products')
  async getExchangeProducts() {
    return await this.productsService.getExchangeProducts();
  }
}
