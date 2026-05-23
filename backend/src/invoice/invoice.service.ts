import { Injectable } from '@nestjs/common';
import { InvoiceLine } from 'src/models/invoice-line.dto';
import pdfParse from 'pdf-parse';

@Injectable()
export class InvoiceService {
  async extractFromPdf(buffer: Buffer): Promise<InvoiceLine[]> {
    const pdf = await pdfParse(buffer);

    const lines = pdf.text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const invoiceLines: InvoiceLine[] = [];

    for (let i = 0; i < lines.length; i++) {
      const productMatch = lines[i].match(/^([A-Z0-9]+)\s+(.+)$/);

      if (!productMatch) {
        continue;
      }

      const productCode = productMatch[1];
      const productName = productMatch[2];

      const nextLine = lines[i + 1];
      const repeatedCode = lines[i + 2];

      const looksLikeInvoiceProduct =
        /^\d+$/.test(nextLine ?? '') && repeatedCode === productCode;

      if (!looksLikeInvoiceProduct) {
        continue;
      }

      const previousLines = lines.slice(Math.max(0, i - 10), i);

      const unitPrice = previousLines.find((line) =>
        /^-?\d+(?:\.\d+)?$/.test(line),
      );

      const currency = previousLines.find((line) =>
        /^(RON|EUR|USD)$/.test(line),
      );

      const quantities = previousLines.filter((line) =>
        /^-?\d+(?:\.\d+)?$/.test(line),
      );

      const quantity =
        quantities.find((value) => value.startsWith('-')) ?? quantities[1];

      if (!unitPrice || !currency || !quantity) {
        continue;
      }

      invoiceLines.push({
        productCode,
        productName,
        unitPrice: Number(unitPrice),
        currency,
        quantity: Number(quantity),
      });
    }

    return invoiceLines;
  }
}
