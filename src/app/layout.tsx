import Link from 'next/link';
import { headers } from 'next/headers';

export const metadata = {
  title: 'ASOS Upstream Supply',
  description: 'SKU Catalog Manager',
};

function BackButton() {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';
  
  if (pathname === '/' || pathname === '') return null;
  
  return (
    <div style={{ marginBottom: 16 }}>
      <Link href="/" style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 8, 
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        textDecoration: 'none',
        color: '#374151',
        fontSize: '14px',
        backgroundColor: 'white',
        transition: 'all 150ms ease'
      }}>
        ← Back to Home
      </Link>
    </div>
  );
}

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
          <BackButton />
          {children}
        </main>
      </body>
    </html>
  );
}


