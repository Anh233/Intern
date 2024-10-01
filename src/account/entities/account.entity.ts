import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account')
export class AccountEntity {
  @PrimaryColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column()
  email?: string;

  @Column({ name: 'phone_number' })
  phoneNumber?: string;

  @Column({ name: 'role_id' })
  roleId!: number;

  @Column({ name: 'is_active' })
  isActive!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt!: Date;

  @Column({ name: 'update_by' })
  updateBy!: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;
}
