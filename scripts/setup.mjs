/* eslint-disable no-console */
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

// const VERSION = 1;

const setup = async () => {
  execSync('npx prisma generate');
  execSync('npx prisma db push');
};

setup();
