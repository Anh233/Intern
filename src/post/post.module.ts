import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { AccountEntity } from 'src/account/entities/account.entity';
import { PostEntity } from './entities/post.entity';
import { PostController } from './post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, AccountEntity])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
