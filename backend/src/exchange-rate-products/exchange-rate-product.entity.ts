import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

//Entitate exchange_product, pe baza acestui model se creeaza tabelul cu produse cu schimb valutar in DB
//Numele unui produs este unic
//Am folosit UUID peste tot pentru id-uri
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
