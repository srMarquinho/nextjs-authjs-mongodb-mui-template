'use client';

import { Suspense, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Link, TextField, Typography } from '@mui/material';
import { NewPasswordFormData, NewPasswordSchema } from '@/lib/schemas/auth-schemas';
import { newPassword } from '@/actions/new-password';
import { type ActionResponse } from '@/actions/types';
import { useSearchParams } from 'next/navigation';

const defaultValues = {
  password: '',
};

function NewPasswordFormComponent() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [isPending, startTransition] = useTransition();

  const [loginResult, setLoginResult] = useState<ActionResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues,
  });

  const onSubmit = (data: NewPasswordFormData) => {
    setLoginResult(null);
    startTransition(async () => {
      const res = await newPassword(data, token);
      setLoginResult(res);
    });
  };

  return (
    <Box
      component="form"
      sx={{
        mt: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography component="h1" variant="h5">
        Altere sua senha
      </Typography>

      <TextField
        label="Senha"
        margin="normal"
        fullWidth
        type="password"
        id="password"
        InputLabelProps={{ shrink: true }}
        autoComplete="password"
        defaultValue={defaultValues.password}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isPending}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('password')}
      />

      {!!loginResult?.error && (
        <Alert
          severity="error"
          sx={{ my: 1 }}
        >
          {loginResult?.error}
          {' '}
          <Link href="/auth/login">Faça o Login</Link>
          {' '}
          ou
          {' '}
          <Link href="/auth/register">Crie uma Conta</Link>
        </Alert>
      )}

      {!!loginResult?.success && (
        <Alert
          severity="success"
          sx={{ my: 1 }}
        >
          {loginResult.success}
          {' '}
          <Link href="/auth/login">Faça o Login</Link>
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ my: 2 }}
        disabled={isPending}
      >
        Alterar senha
      </Button>

    </Box>
  );
}

export function NewPasswordForm() {
  return (
    <Suspense>
      <NewPasswordFormComponent />
    </Suspense>
  );
}
