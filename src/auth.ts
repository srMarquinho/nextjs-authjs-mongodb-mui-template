/* eslint-disable no-param-reassign */
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { getUserById } from '@/data/user';
import db from '@/db';
import { UserRole } from '@prisma/client';
import authConfig from './auth.config';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: 'auth/error',
  },
  // NOTE: linkAccount event for OAuth - leaving it here for reference
  // events: {
  //   async linkAccount({ user }) {
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() },
  //     });
  //   },
  // },
  callbacks: {
    async signIn({ user }) {
      if (!user?.id) {
        return false;
      }

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) {
        return token;
      }

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
});
