import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string().min(1, {
    message: 'Senha é obrigatória',
  }),
  code: z.optional(z.string()),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: 'Nome é obrigatório',
  }),
  email: z.string().email({
    message: 'Email inválido',
  }),
  password: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email inválido',
  }),
});

export type ResetFormData = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Senha deve ter no mínimo 6 caracteres',
  }),
});

export type NewPasswordFormData = z.infer<typeof NewPasswordSchema>;
