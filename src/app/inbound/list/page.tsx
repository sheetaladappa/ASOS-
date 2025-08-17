import Link from 'next/link';

async function fetchInbounds() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/inbound`, { next: { revalidate: 0 } });
  if (!res.ok) return { items: [] };
  return res.json();
}

export default async function InboundListPage() {
  const { items } = await fetchInbounds();
  return (
    <section>
      <h2>Inbound Shipments</h2>
      <div style={{ margin: '12px 0' }}>
        <Link href="/inbound/new"><button>Add Inbound</button></Link>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Inbound ID</th>
              <th style={{ textAlign: 'left' }}>PO ID</th>
              <th style={{ textAlign: 'left' }}>SKU</th>
              <th style={{ textAlign: 'left' }}>Supplier</th>
              <th style={{ textAlign: 'left' }}>Courier</th>
              <th style={{ textAlign: 'left' }}>Tracking #</th>
              <th style={{ textAlign: 'left' }}>ETA</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Created</th>
              <th style={{ textAlign: 'left' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 20 }}>No inbound shipments</td></tr>
            ) : items.map((inb: any) => (
              <tr key={inb.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                  <Link href={`/inbound/${inb.id}`}>{inb.id}</Link>
                </td>
                <td>{inb.poId}</td>
                <td>{inb.po.sku.name}</td>
                <td>{inb.po.supplier.name}</td>
                <td>{inb.courier}</td>
                <td>{inb.trackingNumber}</td>
                <td>{inb.eta ? new Date(inb.eta).toLocaleString() : '-'}</td>
                <td>{inb.status}</td>
                <td>{new Date(inb.createdAt).toLocaleString()}</td>
                <td>{new Date(inb.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}


