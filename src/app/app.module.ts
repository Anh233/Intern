import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import app from 'src/config/app';
import { AccountTokenModule } from 'src/account/modules/account-token/account-token.module';
import { RolesGuard } from 'src/guards/roles.guard';
import { ChatSessionsModule } from 'src/chat-session/chat-session.module';
import { MessagesModule } from 'src/messgae/message.module';
import { AccountDetailModule } from 'src/account/modules/account-detail/account-detail.module';
import { RoleModule } from 'src/role/role.module';
import { CategoryModule } from 'src/category/category.module';
import { StorageS3Module } from 'src/storage/storage-s3.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'Intern',
        synchronize: false,
        autoLoadEntities: true,
      }),
    }),
    AccountModule,
    AccountTokenModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [app],
    }),
    ChatSessionsModule,
    MessagesModule,
    AccountDetailModule,
    RoleModule,
    CategoryModule,
    StorageS3Module,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
