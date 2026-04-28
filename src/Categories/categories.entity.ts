import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {

  @PrimaryGeneratedColumn()
  id_category: number;

  @Column({ length: 50 })
  name: string;

  @Column({ default: true })
  active: boolean;
}