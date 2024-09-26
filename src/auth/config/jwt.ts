import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.jwt_secret,
  signOptions: {
    expiresIn: process.env.expiresIn,
  },
}));
