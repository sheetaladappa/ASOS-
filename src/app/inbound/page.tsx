import Link from 'next/link';

export default function InboundHomePage() {
  return (
    <section>
      <h2>Basic Inbound Tracker</h2>
      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <Link href="/inbound/new"><button>Add Inbound Shipment</button></Link>
        <Link href="/inbound/list"><button>View Inbound Shipments</button></Link>
      </div>
    </section>
  );
}


