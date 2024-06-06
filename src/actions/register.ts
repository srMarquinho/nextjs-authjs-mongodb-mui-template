'use server';

import { hash } from 'bcryptjs';
import db from '@/db';
import { RegisterFormData, RegisterSchema } from '@/lib/schemas/auth-schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mailer/actions';

export async function register(values: RegisterFormData) {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: validatedFields.error?.message || 'Algo deu errado!' };
  }

  const {
    email,
    password,
    name,
  } = validatedFields.data;

  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email já em uso!' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'E-mail de confirmação enviado! Verifique seu e-mail.' };
}
