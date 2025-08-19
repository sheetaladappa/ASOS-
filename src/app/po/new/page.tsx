'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SkuOption {
  id: string;
  name: string;
  supplier: {
    id: string;
    name: string;
  };
}

export default function NewPoPage() {
  const [skus, setSkus] = useState<SkuOption[]>([]);
  const [selectedSkuId, setSelectedSkuId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadSkus() {
      try {
        const res = await fetch('/api/skus');
        if (res.ok) {
          const data = await res.json();
          setSkus(data.items);
        }
      } catch {
        setError('Failed to load SKUs');
      } finally {
        setLoading(false);
      }
    }
    loadSkus();
  }, []);

  const selectedSku = skus.find(s => s.id === selectedSkuId);

  async function handleApprove() {
    if (!selectedSkuId || quantity < 1) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const res = await fetch('/api/po', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skuId: selectedSkuId, quantity }),
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Link href="/po" style={{ 
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
          ← Back to POs
        </Link>
        <h2 style={{ margin: 0 }}>Create Purchase Order</h2>
      </div>
      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', color: '#a00', padding: 12, borderRadius: 4 }}>{error}</div>
      )}
      <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          <div>SKU</div>
          <select value={selectedSkuId} onChange={(e) => setSelectedSkuId(e.target.value)} disabled={loading}>
            <option value="">{loading ? 'Loading...' : 'Select SKU'}</option>
            {skus.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.supplier.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Quantity</div>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        
        {selectedSku && (
          <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, background: '#f9fafb' }}>
            <h3>Preview</h3>
            <div><strong>SKU:</strong> {selectedSku.name}</div>
            <div><strong>Supplier:</strong> {selectedSku.supplier.name}</div>
            <div><strong>Quantity:</strong> {quantity}</div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleApprove} disabled={!selectedSkuId || quantity < 1 || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Approve and Create PO'}
          </button>
          <Link href="/po" style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 4, textDecoration: 'none' }}>Cancel</Link>
        </div>
      </div>
    </section>
  );
}
