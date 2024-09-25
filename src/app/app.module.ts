import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { AccountTokenModule } from 'src/account_token/account_token.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'Intern',
      synchronize: false,
      autoLoadEntities: true,
    }),
    AccountModule,
    AccountTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
