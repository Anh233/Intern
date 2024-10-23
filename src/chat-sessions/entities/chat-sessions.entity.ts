import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chat_sessions')
export class ChatSessionsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'customer_id' })
  customerId!: number;

  @Column({ name: 'assigned_id', nullable: true })
  assignedId?: number;

  @Column()
  status!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category?: string;

  @Column({ name: 'is_resolved' })
  isResolved!: number;

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
}
