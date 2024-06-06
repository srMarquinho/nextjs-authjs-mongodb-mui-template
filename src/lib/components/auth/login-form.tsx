'use client';

import { Suspense, useState, useTransition } from 'react';
import { FieldErrors, UseFormRegister, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { LoginFormData, LoginSchema } from '@/lib/schemas/auth-schemas';
import { login } from '@/actions/login';
import { type ActionResponse } from '@/actions/types';
import { useSearchParams } from 'next/navigation';

const defaultValues = {
  email: '',
  password: '',
};

type FormFieldsProps = {
  errors: FieldErrors<LoginFormData>,
  isPending: boolean,
  register: UseFormRegister<LoginFormData>,
};

function EmailPasswordFields({
  errors,
  isPending,
  register,
}: FormFieldsProps) {
  return (
    <>
      <TextField
        label="Email"
        margin="normal"
        fullWidth
        id="email"
        autoComplete="email"
        InputLabelProps={{ shrink: true }}
        autoFocus
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
        autoComplete="password"
        defaultValue={defaultValues.password}
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isPending}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register('password')}
      />
    </>
  );
}

function TwoFactorFields({
  errors,
  isPending,
  register,
}:FormFieldsProps) {
  return (
    <TextField
      label="Código de autenticação em duas etapas"
      margin="normal"
      fullWidth
      id="code"
      autoFocus
      error={!!errors.code}
      helperText={errors.code?.message}
      disabled={isPending}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...register('code')}
    />
  );
}

function LoginFormComponent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const [isPending, startTransition] = useTransition();

  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const [loginResult, setLoginResult] = useState<ActionResponse | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = (data: LoginFormData) => {
    setLoginResult(null);
    startTransition(async () => {
      try {
        const res = await login(data, redirectTo);
        if (res.twoFactor) {
          setShowTwoFactor(true);
        } else {
          reset();
          setLoginResult(res);
        }
      } catch (error) {
        setLoginResult({ error: 'Algo deu errado' });
      }
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
        Login
      </Typography>

      {showTwoFactor ? (
        <TwoFactorFields
          errors={errors}
          isPending={isPending}
          register={register}
        />
      ) : (
        <EmailPasswordFields
          errors={errors}
          isPending={isPending}
          register={register}
        />
      )}

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

      {/* <FormControlLabel
          label="Lembre-me"
          disabled={isPending}
          control={
            <Checkbox value="remember" color="primary" />
          }
        /> */}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ my: 2 }}
        disabled={isPending}
      >
        {showTwoFactor ? 'Confirmar' : 'Login'}
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
        <Grid item xs>
          <Typography component="h1" variant="body2">
            {showTwoFactor ? (
              <Link href="/auth/login" onClick={() => setShowTwoFactor(false)}>Voltar ao Login</Link>
            ) : (
              <Link href="/auth/reset">Esqueci minha senha</Link>
            )}
          </Typography>
        </Grid>

        {!showTwoFactor && (
          <Grid item>
            <Typography component="h1" variant="body2">
              Não tem uma conta?
              {' '}
              <Link href="/auth/register">Crie uma Conta</Link>
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormComponent />
    </Suspense>
  );
}
