'use client';

import { Copyright } from '@/lib/components';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const onClick = () => {
    router.push('/auth/login');
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          HOME
        </Typography>

        <Button
          onClick={onClick}
        >
          Login
        </Button>

        <Copyright />
      </Box>
    </Container>
  );
}
