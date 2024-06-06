import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig, User } from 'next-auth';
import { compare } from 'bcryptjs';

import { LoginSchema } from '@/lib/schemas/auth-schemas';
import { getUserByEmail } from './data/user';

export default {
  providers: [Credentials({
    async authorize(credentials) {
      const validatedFields = LoginSchema.safeParse(credentials);

      if (validatedFields.success) {
        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user?.password) {
          return null;
        }

        const passwordsMatch = await compare(
          password,
          user.password,
        );

        if (passwordsMatch) {
          return user satisfies User;
        }
      }
      return null;
    },
  })],
} satisfies NextAuthConfig;
