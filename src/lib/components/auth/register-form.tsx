'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Grid, TextField, Typography, Link, Alert } from '@mui/material';
import { RegisterFormData, RegisterSchema } from '@/lib/schemas/auth-schemas';
import { register as registerAction } from '@/actions/register';
import { type ActionResponse } from '@/actions/types';

const defaultValues = {
  name: '',
  email: '',
  password: '',
};

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();

  const [registerResult, setRegisterResult] = useState<ActionResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const onSubmit = (data: RegisterFormData) => {
    setRegisterResult(null);
    startTransition(async () => {
      const res = await registerAction(data);
      setRegisterResult(res);
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
        Criar Usuário
      </Typography>

      <TextField
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('name')}
        label="Nome"
        margin="normal"
        fullWidth
        id="name"
        autoComplete="name"
        InputLabelProps={{ shrink: true }}
        autoFocus
        defaultValue={defaultValues.name}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isPending}
      />

      <TextField
        label="Email"
        margin="normal"
        fullWidth
        id="email"
        autoComplete="email"
        InputLabelProps={{ shrink: true }}
        defaultValue={defaultValues.email}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isPending}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('email')}
      />

      <TextField
        label="Senha"
        margin="normal"
        fullWidth
        type="password"
        id="password"
        InputLabelProps={{ shrink: true }}
        autoComplete="current-password"
        defaultValue={defaultValues.password}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isPending}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('password')}
      />

      {!!registerResult?.error && (
        <Alert
          severity="error"
          sx={{ my: 1 }}
        >
          {registerResult.error}
          {' '}
          <Link href="/auth/login">Faça o Login</Link>
        </Alert>
      )}

      {!!registerResult?.success && (
        <Alert
          severity="success"
          sx={{ my: 1 }}
        >
          {registerResult.success}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isPending}
      >
        Criar Usuário
      </Button>

      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Typography component="h1" variant="body2">
            Já tem uma conta?
            {' '}
            <Link href="/auth/login">Faça o Login</Link>
          </Typography>
        </Grid>
      </Grid>

    </Box>
  );
}
