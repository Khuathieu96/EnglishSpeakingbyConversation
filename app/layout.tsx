import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'English Speaking Practice',
  description: 'Practice English speaking with AI-guided conversations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
