import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account_detail')
export class AccountDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  gender!: number;

  @Column({ name: 'date_of_birth' })
  dateOfBirth!: Date;

  @Column()
  address!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy?: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updateAt?: Date;

  @Column({ name: 'updated_by' })
  updateBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;
}
