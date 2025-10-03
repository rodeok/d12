import './globals.css';
import type { Metadata } from 'next';
import Providers from './providers';


export const metadata: Metadata = {
  title: 'PropertyManager - Complete Landlord Management Solution',
  description: 'Manage properties, tenants, rent tracking, and automated reminders with mapping and document storage.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-satoshi antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}