import Link from 'next/link';

export default function PoHome() {
  return (
    <section>
      <h2>Smart Purchase Orders</h2>
      <p style={{ color: '#4b5563' }}>Generate and track purchase orders.</p>
      <div style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
        <Link href="/po/new">
          <button>Create PO</button>
        </Link>
        <Link href="/po/list">
          <button>View PO List</button>
        </Link>
      </div>
    </section>
  );
}
