'use server';

import { hash } from 'bcryptjs';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import db from '@/db';
import { NewPasswordFormData, NewPasswordSchema } from '@/lib/schemas/auth-schemas';

export async function newPassword(
  values: NewPasswordFormData,
  token: string | null,
) {
  if (!token) {
    return { error: 'Token não encontrado!' };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token não encontrado!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token expirado!' };
  }

  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email não encontrado!' };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Senha alterada.' };
}
