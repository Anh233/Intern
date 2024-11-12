import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountDetailModel } from '../models/account-detail.model';

@Entity('account_detail')
export class AccountDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AccountDetailEntity, (account) => account.id)
  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Column()
  gender?: number;

  @Column({ name: 'date_of_birth' })
  dateOfBirth!: String;

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

  toModel(): AccountDetailModel {
    return new AccountDetailModel(
      this.accountId,
      this.firstName,
      this.lastName,
      this.gender,
      this.dateOfBirth,
      this.address,
    );
  }
}
