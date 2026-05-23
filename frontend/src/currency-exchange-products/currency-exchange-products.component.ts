import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { switchMap } from 'rxjs';
import { CurrencyExchangeProduct } from '../models/currency-exchange-product.model';
import { ProductsService } from '../services/products.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-currency-exchange-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './currency-exchange-products.component.html',
  styleUrl: './currency-exchange-products.component.css',
})
export class CurrencyExchangeProductsComponent implements OnInit {
  dataSource = new MatTableDataSource<CurrencyExchangeProduct>([]);

  displayedColumns: string[] = [
    'imageUrl',
    'name',
    'description',
    'priceUsd',
    'usdRonRate',
    'priceRon',
    'exchangeRateDate',
  ];

  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadExchangeProducts();
  }

  loadExchangeProducts(): void {
    this.productsService.getExchangeProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      error: (error) => {
        console.error('Eroare la incarcarea produselor convertite:', error);
      },
    });
  }

  convertProducts(): void {
    this.productsService
      .convertProductsToRon()
      .pipe(switchMap(() => this.productsService.getExchangeProducts()))
      .subscribe({
        next: (products) => {
          this.dataSource.data = products;
          this.showSuccessMessage(
            'Toate produsele au fost convertite folosind cursul valutare valabil azi.',
          );
        },
        error: (error) => {
          console.error('Eroare la conversia produselor:', error);
        },
      });
  }

  deleteAllExchangeProducts(): void {
    this.productsService.deleteAllExchangeProducts().subscribe({
      next: () => {
        this.dataSource.data = [];
        this.showSuccessMessage('Ai sters toate produsele cu schimb valutar.');
      },
      error: (error) => {
        console.error('Eroare la stergerea produselor cu curs valutar:', error);
      },
    });
  }
  showSuccessMessage(message: string): void {
    this.snackBar.open(`✓  ${message}`, '', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}
