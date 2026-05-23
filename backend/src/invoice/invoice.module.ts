import { Module } from '@nestjs/common';
import { InvoicesController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  providers: [InvoiceService],
  controllers: [InvoicesController],
})
export class InvoiceModule {}
