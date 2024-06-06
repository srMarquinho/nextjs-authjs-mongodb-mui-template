import { sharedMetadata } from '@/lib/shared-metadata';
import { percent } from '@/lib/utils/helper-functions';
import Image from 'next/image';

export function AuthLogo() {
  return (
    <Image
      alt={sharedMetadata.title as string}
      src="/img/logo-transparent.png"
      sizes="100vw"
      style={{
        width: '65%',
        height: 'auto',
      }}
      width={percent(396, 65)}
      height={percent(135, 65)}
    />
  );
}
