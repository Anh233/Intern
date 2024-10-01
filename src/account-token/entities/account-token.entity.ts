import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account_token')
export class AccountTokenEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column({ name: 'token_key' })
  tokenKey!: string;

  @Column({ name: 'is_active' })
  isActive!: number;

  @Column({ name: 'created_at' })
  createdAt?: Date;

  @Column({ name: 'created_by' })
  createdBy?: number;

  @Column({ name: 'updated_at' })
  updatedAt?: Date;

  @Column({ name: 'updated_by' })
  updatedBy?: number;

  @Column({ name: 'deleted_at' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;
}
