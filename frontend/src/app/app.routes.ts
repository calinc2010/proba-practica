import { Routes } from '@angular/router';
import { InvoiceUploadComponent } from '../components/invoice-upload/invoice-upload.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LayoutComponent } from '../layout/layout.component';
import { CurrencyExchangeProductsComponent } from '../currency-exchange-products/currency-exchange-products.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'products',
        component: DashboardComponent,
      },
      {
        path: 'invoice-upload',
        component: InvoiceUploadComponent,
      },
      {
        path: 'exchange-products',
        component: CurrencyExchangeProductsComponent,
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },
];
