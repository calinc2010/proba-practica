import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceLine } from '../../models/invoice-line.model';

@Component({
  selector: 'app-invoice-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatTableModule],
  templateUrl: './invoice-upload.component.html',
  styleUrl: './invoice-upload.component.css',
})
export class InvoiceUploadComponent {
  invoiceLines: InvoiceLine[] = [];

  displayedColumns: string[] = [
    'productCode',
    'productName',
    'unitPrice',
    'currency',
    'quantity',
    'export',
  ];

  constructor(private invoiceService: InvoiceService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.invoiceService.extractInvoice(file).subscribe({
      next: (lines) => {
        this.invoiceLines = lines;
      },
      error: (error) => {
        console.error('Eroare la parsarea facturii:', error);
      },
    });
  }

  exportCsv(): void {
    const header = [
      'Cod produs',
      'Denumire produs',
      'Pret unitar',
      'Moneda',
      'Cantitate',
    ];

    const rows = this.invoiceLines.map((line) => [
      line.productCode,
      line.productName,
      line.unitPrice,
      line.currency,
      line.quantity,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoice-products.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
