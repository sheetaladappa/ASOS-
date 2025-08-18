import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function fetchInbound(id: string) {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/inbound/${id}`, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const { item } = await res.json();
  return item;
}

export default async function InboundDetailPage({ params }: { params: { id: string } }) {
  const item = await fetchInbound(params.id);
  if (!item) return <section>Not found</section>;
  return (
    <section>
      <h2>Inbound Details</h2>
      <div style={{ marginBottom: 12 }}>
        <Link href="/inbound/list"><button>Back to list</button></Link>
      </div>
      <div style={{ display: 'grid', gap: 8, maxWidth: 720 }}>
        <div><strong>ID:</strong> {item.id}</div>
        <div><strong>PO:</strong> {item.poId} — {item.po?.sku?.name} — {item.po?.supplier?.name}</div>
        <div><strong>Courier:</strong> {item.courier}</div>
        <div><strong>Tracking #:</strong> {item.trackingNumber}</div>
        <div><strong>ETA:</strong> {item.eta ? new Date(item.eta).toLocaleString() : '-'}</div>
        <div><strong>Status:</strong> {item.status}</div>
        <div><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</div>
        <div><strong>Updated:</strong> {new Date(item.updatedAt).toLocaleString()}</div>
      </div>
    </section>
  );
}


