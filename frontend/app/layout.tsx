import './globals.css';

export const metadata = {
  title: 'TaxZone',
  description: 'Enterprise tax consultancy SaaS platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

