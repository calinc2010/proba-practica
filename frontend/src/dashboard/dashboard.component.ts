import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ProductDialogComponent } from '../components/product-dialog/product-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, EMPTY } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'imageUrl',
    'name',
    'description',
    'price',
    'actions',
  ];

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      error: (error) => {
        console.error('Eroare la incarcarea produselor:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'price':
          return Number(item.price);

        default:
          return item[property as keyof Product] ?? '';
      }
    };
  }

  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: product,
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((editedProduct: Product | null) => {
          if (!editedProduct) {
            return EMPTY;
          }

          return this.productsService.updateProduct(
            editedProduct.id,
            editedProduct,
          );
        }),
      )
      .subscribe({
        next: (updatedProduct) => {
          this.dataSource.data = this.dataSource.data.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product,
          );

          this.showSuccessMessage('Ai editat un produs');
        },
        error: (error) => {
          console.error('Eroare la editarea produsului:', error);
        },
      });
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmare stergere',
        message: `Sigur vrei sa stergi produsul "${product.name}"?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((confirmed: boolean) => {
          if (!confirmed) {
            return EMPTY;
          }

          return this.productsService.deleteProduct(product.id);
        }),
      )
      .subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(
            (p) => p.id !== product.id,
          );

          this.showSuccessMessage('Produsul a fost sters cu succes');
        },
        error: (error) => {
          console.error('Eroare la stergerea produsului:', error);
        },
      });
  }

  runManualScrape(): void {
    this.productsService
      .runManualScrape()
      .pipe(switchMap(() => this.productsService.getProducts()))
      .subscribe({
        next: (products) => {
          this.dataSource.data = products;
          this.showSuccessMessage('Scrape-ul a rulat cu succes');
        },
        error: (error) => {
          console.error('Eroare la rularea scrape-ului:', error);
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
