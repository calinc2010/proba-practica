import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('exchange_products')
@Unique(['originalProductId', 'exchangeRateDate'])
export class ExchangeProduct {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  originalProductId?: string;

  @Column()
  imageUrl?: string;

  @Column()
  name?: string;

  @Column('text')
  description?: string;

  @Column()
  priceUsd?: string;

  @Column()
  priceRon?: string;

  @Column()
  usdRonRate?: string;

  @Column()
  exchangeRateDate?: string;
}
