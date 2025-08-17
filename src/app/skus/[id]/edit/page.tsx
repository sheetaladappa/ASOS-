'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Supplier {
  id: string;
  name: string;
  status: string;
}

interface Sku {
  id: string;
  name: string;
  description: string | null;
  category: string;
  cost: number;
  supplierId: string;
  leadTime: number;
}

export default function EditSkuForm({ params }: { params: { id: string } }) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sku, setSku] = useState<Sku | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [skuResponse, suppliersResponse] = await Promise.all([
          fetch(`/api/skus/${params.id}`),
          fetch('/api/suppliers')
        ]);

        if (skuResponse.ok && suppliersResponse.ok) {
          const [skuData, suppliersData] = await Promise.all([
            skuResponse.json(),
            suppliersResponse.json()
          ]);
          setSku(skuData);
          setSuppliers(suppliersData);
        } else {
          setError('Failed to load SKU data');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/skus/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        router.push('/skus');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update SKU');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!sku) {
    return <div>SKU not found</div>;
  }

  return (
    <section>
      <h2>Edit SKU</h2>
      {error && (
        <div style={{ 
          padding: '12px', 
          marginBottom: '16px', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          borderRadius: '4px',
          color: '#c33'
        }}>
          {error}
        </div>
      )}
      <form action={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
        <label>
          <div>Name</div>
          <input name="name" required maxLength={200} defaultValue={sku.name} />
        </label>
        <label>
          <div>Description</div>
          <textarea name="description" rows={4} defaultValue={sku.description || ''} />
        </label>
        <label>
          <div>Category</div>
          <input name="category" required defaultValue={sku.category} />
        </label>
        <label>
          <div>Cost</div>
          <input name="cost" type="number" step="0.01" min="0" required defaultValue={String(sku.cost)} />
        </label>
        <label>
          <div>Supplier</div>
          <select name="supplierId" required defaultValue={sku.supplierId}>
            {suppliers.map((supplier, index) => (
              <option key={supplier.id} value={`supplier-${index + 1}`}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Lead time (days)</div>
          <input name="leadTime" type="number" min="0" required defaultValue={String(sku.leadTime)} />
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <a href="/skus" style={{ padding: '8px 16px', textDecoration: 'none', border: '1px solid #ccc', borderRadius: '4px' }}>Cancel</a>
        </div>
      </form>
    </section>
  );
}


