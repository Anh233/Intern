import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from 'src/account/account.module';
import jwt from './config/auth';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AccountTokenModule } from 'src/account-token/account-token.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      load: [jwt],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('jwt') as JwtModuleAsyncOptions;
      },
    }),
    AccountModule,
    AccountTokenModule, // Thêm AccountTokenModule vào imports
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
