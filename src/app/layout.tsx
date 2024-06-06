import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { sharedMetadata } from '@/lib/shared-metadata';
import { ThemeProvider } from '@/lib/components';

export const metadata: Metadata = { ...sharedMetadata };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
