import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

//Entitate product, pe baza acestui model se creeaza tabelul in DB
//Numele unui produs este unic
//Am folosit UUID peste tot pentru id-uri
@Entity('product')
@Unique(['name'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  imageUrl?: string;

  @Column()
  name?: string;

  @Column()
  price?: string;

  @Column('text')
  description?: string;
}
