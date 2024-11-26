import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'chat_session_id' })
  chatSessionId!: number;

  @Column({ name: 'account_id' })
  accountId!: number;

  @Column()
  message!: string;

  @Column({ name: 'image_url' })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updateAt!: Date;

  @Column({ name: 'updated_by' })
  updateBy!: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt?: Date;

  @Column({ name: 'deleted_by' })
  deletedBy?: number;
}
