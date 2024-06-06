'use server';

import { LoginFormData, LoginSchema } from '@/lib/schemas/auth-schemas';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/routes';
import { AuthError } from 'next-auth';
import { generateTwoFactorToken, generateVerificationToken } from '@/lib/tokens';
import { getUserByEmail } from '@/data/user';
import { sendTwoFactorTokenEmail, sendVerificationEmail } from '@/lib/mailer/actions';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import db from '@/db';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export async function login(
  values: LoginFormData,
  redirectTo: string | null,
) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Email ou password inválido!' };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email || !existingUser.password) {
    return { error: 'Email ou password inválido!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: 'E-mail de confirmação enviado! Verifique seu e-mail.' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: 'Código de autenticação em duas etapas inválido!' };
      }

      if (twoFactorToken.token !== code) {
        return { error: 'Código de autenticação em duas etapas inválido!' };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: 'Código de autenticação em duas etapas expirado!' };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: redirectTo || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: 'Dados de acesso válidados.' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
      case 'CredentialsSignin':
        return { error: 'Email ou password inválido!' };
      default:
        return { error: 'Algo deu errado!' };
      }
    }
    throw error;
  }
}
