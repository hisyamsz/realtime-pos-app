import { Geist } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/themes-provider';
import { AuthStoreProvider } from '@/providers/auth-store-provider';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Toaster } from '@/components/ui/sonner';
import { cookies } from 'next/headers';
import { Profile } from '@/types/auth';
import { INITIAL_STATE_PROFILE } from '@/constants/auth-constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get('user_profile')?.value;

  let initialProfile: Profile = INITIAL_STATE_PROFILE;
  if (profileCookie) {
    try {
      initialProfile = JSON.parse(profileCookie);
    } catch (error) {
      console.error('Failed to parse user_profile cookie:', error);
      initialProfile = INITIAL_STATE_PROFILE;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`}>
        <AuthStoreProvider initialProfile={initialProfile}>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </ReactQueryProvider>
        </AuthStoreProvider>
      </body>
    </html>
  );
}
