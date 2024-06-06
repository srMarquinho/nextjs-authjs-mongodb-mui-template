import { Box, Button } from '@mui/material';
import { auth, signOut } from '@/auth';

export default async function Settings() {
  const session = await auth();

  return (
    <Box>
      {JSON.stringify(session, null, 2)}

      <Box
        component="form"
        action={async () => {
          'use server';

          await signOut({ redirectTo: '/auth/login', redirect: true });
        }}
      >
        <Button type="submit">
          Logout
        </Button>
      </Box>
    </Box>
  );
}
