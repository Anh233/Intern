import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
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

      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>(
            'auth.jwt.signOptions.expiresIn',
          ),
        },
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    AccountTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
