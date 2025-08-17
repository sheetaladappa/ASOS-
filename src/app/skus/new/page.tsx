'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Supplier {
  id: string;
  name: string;
  status: string;
}

export default function NewSkuForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await fetch('/api/suppliers');
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        }
      } catch (err) {
        console.error('Failed to fetch suppliers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/skus', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/skus');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create SKU');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Create SKU</h2>
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
          <input name="name" required maxLength={200} placeholder="Enter SKU name" />
        </label>
        <label>
          <div>Description</div>
          <textarea name="description" rows={4} placeholder="Enter description" />
        </label>
        <label>
          <div>Category</div>
          <input name="category" required placeholder="e.g., Apparel, Cosmetics" />
        </label>
        <label>
          <div>Cost</div>
          <input name="cost" type="number" step="0.01" min="0" required placeholder="0.00" />
        </label>
        <label>
          <div>Supplier</div>
          <select name="supplierId" required defaultValue="" disabled={loading}>
            <option value="" disabled>
              {loading ? 'Loading suppliers...' : 'Select supplier'}
            </option>
            {suppliers.map((supplier, index) => (
              <option key={supplier.id} value={`supplier-${index + 1}`}>
                {supplier.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Lead time (days)</div>
          <input name="leadTime" type="number" min="0" required placeholder="0" />
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create SKU'}
          </button>
          <a href="/skus" style={{ padding: '8px 16px', textDecoration: 'none', border: '1px solid #ccc', borderRadius: '4px' }}>Cancel</a>
        </div>
      </form>
    </section>
  );
}


