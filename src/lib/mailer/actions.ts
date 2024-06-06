'use server';

import { headers } from 'next/headers';
import { getMailerTransporter } from './transporter';

export async function sendVerificationEmail(
  email:string,
  token: string,
) {
  const host = headers().get('host');

  const confirmLink = `http://${host}/auth/verification?token=${token}`;

  const transporter = getMailerTransporter();

  await transporter.sendMail({
    to: email,
    subject: 'Confirme seu email',
    html: `<p>Para confirmar seu e-mail clique <a href="${confirmLink}">aqui</a>.</p>`,
  });
}

export async function sendPasswordResetEmail(
  email:string,
  token: string,
) {
  const host = headers().get('host');

  const confirmLink = `http://${host}/auth/new-password?token=${token}`;

  const transporter = getMailerTransporter();

  await transporter.sendMail({
    to: email,
    subject: 'Altere sua senha',
    html: `<p>Para alterar sua senha clique <a href="${confirmLink}">aqui</a>.</p>`,
  });
}

export async function sendTwoFactorTokenEmail(
  email: string,
  token: string,
) {
  const transporter = getMailerTransporter();

  await transporter.sendMail({
    to: email,
    subject: 'Código de autenticação em duas etapas',
    html: `<p>O seu código de autenticação em duas etapas: <br><strong>${token}<strong></p>`,
  });
}
