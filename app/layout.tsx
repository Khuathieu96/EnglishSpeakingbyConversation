import type { Metadata } from 'next';
import Script from 'next/script';
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
    <html lang='en'>
      <head>
        <link
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Spline+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-display'>{children}</body>
    </html>
  );
}
