import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trip')
export class TripEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "Plac Europejski 2, Warszawa, Polska"})
  start_address?: string;

  @Column({default: "Plac Europejski 2, Warszawa, Polska"})
  destination_address?: string;

  @Column({default: "100PLN"})
  price?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
