import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'defaultSecret',
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
  },
}));
