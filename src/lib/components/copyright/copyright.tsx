import { Link, SxProps, Theme, Typography } from '@mui/material';
import { sharedMetadata } from '@/lib/shared-metadata';

export function Copyright({ sx }:{ sx?: SxProps<Theme> }) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={sx}>
      {`©  ${new Date().getFullYear()} `}
      <Link color="inherit" href="/">
        {`${sharedMetadata.title}`}
      </Link>
      {' Todos os direitos reservados.'}
    </Typography>
  );
}
