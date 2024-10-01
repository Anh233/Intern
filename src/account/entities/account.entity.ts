import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updateAt!: Date;

  @Column({ name: 'updated_by' })
  updateBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt!: Date;

  @Column({ name: 'deleted_by' })
  deletedBy!: number;
}
