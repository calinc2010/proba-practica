import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceLine } from '../models/invoice-line.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = 'http://localhost:3000/invoices';

  constructor(private http: HttpClient) {}

  extractInvoice(file: File): Observable<InvoiceLine[]> {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file);

    return this.http.post<InvoiceLine[]>(`${this.apiUrl}/extract`, formData);
  }
}
