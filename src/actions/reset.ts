'use server';

import { ResetFormData, ResetSchema } from '@/lib/schemas/auth-schemas';
import { getUserByEmail } from '@/data/user';
import { generatePasswordResetToken } from '@/lib/tokens';
import { sendPasswordResetEmail } from '@/lib/mailer/actions';

export async function reset(values: ResetFormData) {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser?.email) {
    return { error: 'Email não encontrado!' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: 'E-mail de redefinição enviado! Verifique seu e-mail.' };
}
