import { registerAs } from '@nestjs/config';
import { throwError } from 'src/utils/function';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? throwError(),
    signOptions: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? throwError(),
    },
  },
}));
