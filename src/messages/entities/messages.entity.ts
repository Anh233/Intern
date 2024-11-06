import { AccountEntity } from 'src/account/entities/account.entity';
import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class MessagesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ChatSessionEntity, (chatSession) => chatSession.id)
  @Column({ name: 'chat_session_id' })
  chatSessionId!: number;

  @ManyToOne(() => AccountEntity, (account) => account.id)
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
