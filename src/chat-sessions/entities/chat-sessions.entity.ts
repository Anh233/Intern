import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('chat_sessions')
export class ChatSessionsEntity {
  @PrimaryColumn()
  id!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column()
  status!: string;

  @Column()
  category: string | undefined;

  @Column({ name: 'is_resolved' })
  isResolved!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;
}
