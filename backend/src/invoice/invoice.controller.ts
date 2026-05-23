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

  @Post('extract')
  @UseInterceptors(FileInterceptor('file'))
  async extractInvoiceData(@UploadedFile() file: Express.Multer.File) {
    return await this.invoiceService.extractFromPdf(file.buffer);
  }
}
