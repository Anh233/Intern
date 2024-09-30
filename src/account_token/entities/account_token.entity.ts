import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from '../../account/entities/account.entity'; // Điều chỉnh đường dẫn import nếu cần

@Entity('account_token')
export class AccountTokenEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID sẽ được tự động tạo

  // Mối quan hệ ManyToOne với AccountEntity
  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' }) // Sử dụng JoinColumn để định nghĩa khóa ngoại
  account: AccountEntity;

  @Column({ name: 'token_key' })
  tokenkey: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isactive: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdat: Date;

  @Column({ name: 'created_by', type: 'bigint' })
  createdby: number;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedat: Date;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedby: number;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedat: Date;

  @Column({ name: 'deleted_by', type: 'bigint', nullable: true })
  deletedby: number;
}