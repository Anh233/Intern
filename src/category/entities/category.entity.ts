import { ChatSessionEntity } from 'src/chat-session/entities/chat-session.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  categoryId!: number;

  @Column()
  name!: string;

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

  @OneToMany(() => ChatSessionEntity, (chatSession) => chatSession.categoryId)
  chatSession!: ChatSessionEntity[];
}
