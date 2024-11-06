import { AccountTokenEntity } from 'src/account-token/entities/account-token.entity';
import { RoleEntity } from 'src/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  password?: string;

  @Column()
  email?: string;

  @Column({ name: 'phone_number' })
  phoneNumber?: string;

  @ManyToOne(() => RoleEntity, (role) => role.roleId)
  @Column({ name: 'role_id' })
  roleId!: number;

  @Column({ name: 'is_active' })
  isActive!: number;

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

  @OneToMany(() => AccountTokenEntity, (accountToken) => accountToken.accountId)
  tokens!: AccountTokenEntity[];
}
