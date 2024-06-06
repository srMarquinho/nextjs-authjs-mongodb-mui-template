/* eslint-disable no-console */
import db from '@/db';

export const getPasswordResetTokenByToken = async (
  token: string,
) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (
  email: string,
) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};
