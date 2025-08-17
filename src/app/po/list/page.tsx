import Link from 'next/link';

async function fetchPos() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/po`, { next: { revalidate: 0 } });
  if (!res.ok) return { items: [] };
  return res.json();
}

export default async function PoListPage() {
  const { items } = await fetchPos();
  return (
    <section>
      <h2>Purchase Orders</h2>
      <div style={{ margin: '12px 0' }}>
        <Link href="/po/new"><button>Create PO</button></Link>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>PO ID</th>
              <th style={{ textAlign: 'left' }}>SKU</th>
              <th style={{ textAlign: 'left' }}>Supplier</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>ETA</th>
              <th style={{ textAlign: 'left' }}>Created</th>
              <th style={{ textAlign: 'left' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 20 }}>No POs</td></tr>
            ) : items.map((po: any) => (
              <tr key={po.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{po.id}</td>
                <td>{po.sku.name}</td>
                <td>{po.supplier.name}</td>
                <td style={{ textAlign: 'right' }}>{po.quantity}</td>
                <td>{po.status}</td>
                <td>{po.eta ? new Date(po.eta).toLocaleDateString() : '-'}</td>
                <td>{new Date(po.createdAt).toLocaleString()}</td>
                <td>{new Date(po.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
