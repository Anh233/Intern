import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('messages')
export class MessagesEntity {
  @PrimaryColumn()
  id!: number;

  @Column({ name: 'chat_session_id' })
  chatSessionId!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column()
  message!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy?: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;
}
