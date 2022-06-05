import nextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import { Sequelize } from 'sequelize';
import pg from 'pg';

const sequelize = new Sequelize(process.env.DB_URI!, {
  dialect: 'postgres',
  dialectModule: pg,
});

sequelize.sync();

export default nextAuth({
  adapter: SequelizeAdapter(sequelize),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT
          ? +process.env.EMAIL_SERVER_PORT
          : 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});
