'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PoOption { id: string; sku: { name: string }; supplier: { name: string } }

export default function NewInboundPage() {
  const [pos, setPos] = useState<PoOption[]>([]);
  const [poId, setPoId] = useState('');
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [eta, setEta] = useState('');
  const [status, setStatus] = useState<'in_transit' | 'delayed' | 'received'>('in_transit');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadPos() {
      try {
        const res = await fetch('/api/po');
        if (res.ok) {
          const data = await res.json();
          setPos(data.items);
        }
      } catch {
        setError('Failed to load POs');
      } finally {
        setLoading(false);
      }
    }
    loadPos();
  }, []);

  async function handleSubmit() {
    setError(null);
    try {
      const res = await fetch('/api/inbound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poId, courier, trackingNumber, eta, status }),
      });
      if (res.ok) {
        router.push('/inbound/list');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create inbound');
      }
    } catch {
      setError('Network error');
    }
  }

  return (
    <section>
      <h2>Add Inbound Shipment</h2>
      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', color: '#a00', padding: 12, borderRadius: 4 }}>{error}</div>
      )}
      <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          <div>Purchase Order</div>
          <select value={poId} onChange={(e) => setPoId(e.target.value)} disabled={loading}>
            <option value="">{loading ? 'Loading...' : 'Select PO'}</option>
            {pos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id.slice(0, 8)} — {p.sku?.name} — {p.supplier?.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Courier</div>
          <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="DHL, UPS, FedEx" />
        </label>
        <label>
          <div>Tracking Number</div>
          <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="1Z..." />
        </label>
        <label>
          <div>ETA</div>
          <input type="datetime-local" value={eta} onChange={(e) => setEta(e.target.value)} />
        </label>
        <label>
          <div>Status</div>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="in_transit">In transit</option>
            <option value="delayed">Delayed</option>
            <option value="received">Received</option>
          </select>
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleSubmit} disabled={!poId || !courier || !trackingNumber}>Create</button>
          <a href="/inbound/list" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4, textDecoration: 'none' }}>Cancel</a>
        </div>
      </div>
    </section>
  );
}


