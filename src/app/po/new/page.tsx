'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Supplier { id: string; name: string; }
interface Sku { id: string; name: string; supplier: Supplier; }

export default function CreatePoPage() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [skuId, setSkuId] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSkus() {
      try {
        const res = await fetch('/api/skus?page=1&pageSize=100&sort=name:asc');
        if (res.ok) {
          const data = await res.json();
          setSkus(data.items);
        }
      } catch (e) {
        setError('Failed to load SKUs');
      } finally {
        setLoading(false);
      }
    }
    fetchSkus();
  }, []);

  const selected = skus.find((s) => s.id === skuId);

  async function handleApprove() {
    setError(null);
    try {
      const res = await fetch('/api/po', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skuId, quantity }) 
      });
      if (res.ok) {
        router.push('/po/list');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create PO');
      }
    } catch {
      setError('Network error');
    }
  }

  return (
    <section>
      <h2>Create Purchase Order</h2>
      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', color: '#a00', padding: 12, borderRadius: 4 }}>{error}</div>
      )}
      <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          <div>SKU</div>
          <select value={skuId} onChange={(e) => setSkuId(e.target.value)} disabled={loading}>
            <option value="">{loading ? 'Loading...' : 'Select SKU'}</option>
            {skus.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.supplier?.name}</option>
            ))}
          </select>
        </label>
        <label>
          <div>Quantity</div>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        {selected && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 600 }}>Preview</div>
            <div>SKU: {selected.name}</div>
            <div>Supplier: {selected.supplier?.name}</div>
            <div>Quantity: {quantity}</div>
            <div>Status: Draft</div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleApprove} disabled={!skuId || quantity < 1}>Approve & Create PO</button>
          <a href="/po/list" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4, textDecoration: 'none' }}>Cancel</a>
        </div>
      </div>
    </section>
  );
}
