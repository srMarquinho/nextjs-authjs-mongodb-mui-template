import { randomInt, randomUUID } from 'crypto';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import db from '@/db';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { hoursToMilliseconds, minutesToMilliseconds } from './utils/helper-functions';

export async function generateVerificationToken(email: string) {
  const token = randomUUID();
  const expires = new Date(Date.now() + hoursToMilliseconds(1));

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
  const token = randomUUID();
  const expires = new Date(Date.now() + hoursToMilliseconds(1));

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
}

export async function generateTwoFactorToken(email:string) {
  const token = randomInt(100_000, 999_999).toString();

  const expires = new Date(Date.now() + minutesToMilliseconds(5));

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
}
