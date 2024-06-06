'use client';

import { Avatar, Box, Button, Typography } from '@mui/material';
import { WarningOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export function AuthError() {
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
        <WarningOutlined />
      </Avatar>

      <Typography component="h1" variant="h5">
        Oops. Algo deu errado!
      </Typography>

      <Box
        sx={{ mt: 1 }}
      >

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={onClick}
        >
          Retornar ao login
        </Button>

      </Box>
    </>
  );
}
