import Link from 'next/link';

export default function Home() {
  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>Welcome to ASOS Upstream Supply</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
        }}
      >
        <Link href="/skus/new" style={{ textDecoration: 'none' }}>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              background: 'white',
              transition: 'box-shadow 150ms ease, transform 150ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
              Create SKU
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
              Add a new product SKU to the catalog.
            </div>
          </div>
        </Link>
        <Link href="/po" style={{ textDecoration: 'none' }}>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              background: 'white',
              transition: 'box-shadow 150ms ease, transform 150ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
              Smart Purchase Order Creation
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
              Automate procurement: generate POs from SKUs and quantities, approve,
              send PDF/email, and track status.
            </div>
          </div>
        </Link>
        <Link href="/inbound" style={{ textDecoration: 'none' }}>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              background: 'white',
              transition: 'box-shadow 150ms ease, transform 150ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
              Basic Inbound Tracker
            </div>
            <div style={{ fontSize: 13, color: '#4b5563', marginTop: 8 }}>
              Track inbound shipments from suppliers to warehouse. Create and
              monitor ETAs and status.
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}


