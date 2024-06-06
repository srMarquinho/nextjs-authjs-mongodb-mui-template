'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { ResetFormData, ResetSchema } from '@/lib/schemas/auth-schemas';
import { reset } from '@/actions/reset';
import { type ActionResponse } from '@/actions/types';

const defaultValues = {
  email: '',
};

export function ResetForm() {
  const [isPending, startTransition] = useTransition();

  const [loginResult, setLoginResult] = useState<ActionResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(ResetSchema),
    defaultValues,
  });

  const onSubmit = (data: ResetFormData) => {
    setLoginResult(null);
    startTransition(async () => {
      const res = await reset(data);
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
        label="Email"
        id="email"
        autoComplete="email"
        defaultValue={defaultValues.email}
        margin="normal"
        fullWidth
        InputLabelProps={{ shrink: true }}
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={isPending}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('email')}
      />

      {!!loginResult?.error && (
        <Alert
          severity="error"
          sx={{ my: 1 }}
        >
          {loginResult?.error}
        </Alert>
      )}

      {!!loginResult?.success && (
        <Alert
          severity="success"
          sx={{ my: 1 }}
        >
          {loginResult.success}
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

      <Grid
        container
        spacing={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Typography component="h1" variant="body2">
            <Link href="/auth/login">Voltar ao Login</Link>
          </Typography>
        </Grid>
      </Grid>

    </Box>
  );
}
