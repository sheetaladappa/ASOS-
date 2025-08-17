import Link from 'next/link';
export const metadata = {
  title: 'ASOS Upstream Supply',
  description: 'SKU Catalog Manager',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ maxWidth: 1080, margin: '0 auto', padding: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 24 }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <img src="/asos-logo.svg" alt="ASOS" width={120} height={32} />
            </Link>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}


