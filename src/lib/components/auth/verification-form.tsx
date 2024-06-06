'use client';

import { Suspense, useEffect, useState } from 'react';
import { ActionResponse } from '@/actions/types';
import { verification } from '@/actions/verification';
import { Alert, Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerificationFormComponent() {
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const [verificationResult, setVerificationResult] = useState<ActionResponse | null>(null);

  useEffect(() => {
    if (!token) {
      setVerificationResult({ error: 'Token não encontrado!' });
    } else {
      verification(token)
        .then((res) => {
          setVerificationResult(res);
        })
        .catch(() => [
          setVerificationResult({ error: 'Algo deu errado!' }),
        ]);
    }
  }, [token]);

  return (
    <Box
      sx={{
        mt: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      {(!verificationResult?.success && !verificationResult?.error) && (
        <CircularProgress />
      )}

      {!!verificationResult?.error && (
        <Alert
          severity="error"
          sx={{ my: 1 }}
        >
          {verificationResult.error}
        </Alert>
      )}

      {!!verificationResult?.success && (
        <Alert
          severity="success"
          sx={{ my: 1 }}
        >
          {verificationResult.success}
        </Alert>
      )}

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

          <Typography component="h1" variant="body2">
            <Link href="/auth/register">Não tem uma conta?</Link>
          </Typography>
        </Grid>
      </Grid>

    </Box>
  );
}

export function VerificationForm() {
  return (
    <Suspense>
      <VerificationFormComponent />
    </Suspense>
  );
}
