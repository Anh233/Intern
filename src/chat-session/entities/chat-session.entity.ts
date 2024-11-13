import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chat_session')
export class ChatSessionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_account_id' })
  userAccountId!: number;

  @Column({ name: 'as_account_id' })
  assignedAccountId?: number;

  @Column()
  status!: string;

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
