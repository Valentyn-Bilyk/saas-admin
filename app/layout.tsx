import type { Metadata } from 'next';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query';

export const metadata: Metadata = {
  title: 'SaaS Admin – Teams & Billing',
  description: 'Admin dashboard for teams, RBAC & billing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
