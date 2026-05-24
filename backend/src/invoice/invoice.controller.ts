import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InvoiceService } from '../invoice/invoice.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoiceService: InvoiceService) {}

  //Facem un POST request cu fisierul PDF(factura), extragem datele necesare si le returnam catre frontend
  //endpointul este '/invoices/extract'
  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractInvoiceData(@UploadedFile() file: Express.Multer.File) {
    return await this.invoiceService.extractFromPdf(file.buffer);
  }
}
