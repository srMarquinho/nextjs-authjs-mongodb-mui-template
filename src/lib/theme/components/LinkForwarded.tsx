import { forwardRef } from 'react';
import NextLink from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LinkBehaviour(props: any, ref: any) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <NextLink ref={ref} {...props} />;
}
export const LinkForwarded = forwardRef(LinkBehaviour);
