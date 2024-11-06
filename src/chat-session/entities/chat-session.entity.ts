import { AccountEntity } from 'src/account/entities/account.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chat_session')
export class ChatSessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => AccountEntity, (userAccount) => userAccount.id)
  @Column({ name: 'user_account_id' })
  userAccountId!: number;

  @ManyToOne(() => AccountEntity, (asAccount) => asAccount.id)
  @Column({ name: 'as_account_id' })
  assignedId?: number;

  @Column()
  status!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.categoryId)
  @Column({ name: 'category_id' })
  categoryId?: number;

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

  @Column({ name: 'resolved_at', type: 'timestamp' })
  resolvedAt?: Date;

  @Column({ name: 'resolved_by' })
  resolvedBy?: number;
}
