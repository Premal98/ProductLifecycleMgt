import './globals.css';
import type { Metadata } from 'next';
import { Space_Grotesk, Source_Sans_3 } from 'next/font/google';

const heading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap'
});

const body = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'NovaTech PLM',
  description: 'Product Lifecycle Management platform for engineering organizations'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,#e8f1ff_0%,transparent_32%),radial-gradient(circle_at_85%_12%,#f3ecff_0%,transparent_28%)]">
          {children}
        </div>
      </body>
    </html>
  );
}
