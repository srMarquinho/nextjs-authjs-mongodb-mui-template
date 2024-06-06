'use client';

import { createTheme } from '@mui/material/styles';
import { LinkForwarded } from './components/LinkForwarded';

const lightTheme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkForwarded,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkForwarded,
      },
    },
  },
});

export { lightTheme };
