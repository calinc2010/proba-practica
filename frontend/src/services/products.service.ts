import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CurrencyExchangeProduct } from '../models/currency-exchange-product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  updateProduct(id: number, product: Partial<Product>) {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete<{ deleted: boolean; id: number }>(
      `${this.apiUrl}/${id}`,
    );
  }

  convertProductsToRon() {
    return this.http.post<CurrencyExchangeProduct[]>(
      `${this.apiUrl}/convert-exchange`,
      {},
    );
  }

  getExchangeProducts() {
    return this.http.get<CurrencyExchangeProduct[]>(
      `${this.apiUrl}/exchange-products`,
    );
  }

  runManualScrape() {
    return this.http.get<{
      statusCode: number;
      message: string;
    }>(`${this.apiUrl}/scrape`);
  }

  deleteAllExchangeProducts() {
    return this.http.delete<{
      deleted: boolean;
      message: string;
    }>(`${this.apiUrl}/exchange-products`);
  }
}
