import { Box, Card, Grid } from '@mui/material';
import { AuthLogo } from '@/lib/components/auth';
import { Copyright } from '@/lib/components';

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
          position: 'absolute',
          height: '100%',
          width: '100%',
          opacity: '0.3',
        },
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        minHeight="100vh"
      >
        <Grid
          item
          xs={12}
          sm={12}
          lg={4}
          xl={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            elevation={9}
            sx={{
              p: 4,
              zIndex: 1,
              width: '100%',
              maxWidth: '500px',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              <AuthLogo />
            </Box>
            {children}
            <Copyright sx={{ my: 4 }} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
