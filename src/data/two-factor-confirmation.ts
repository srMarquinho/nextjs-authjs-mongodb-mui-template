/* eslint-disable no-console */
import db from '@/db';

export async function getTwoFactorConfirmationByUserId(
  userId: string,
) {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
    return twoFactorConfirmation;
  } catch (error) {
    console.error(error);
    return null;
  }
}
