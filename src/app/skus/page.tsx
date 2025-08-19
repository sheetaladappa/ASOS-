'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Sku {
  id: string;
  name: string;
  description: string | null;
  category: string;
  cost: number;
  supplierId: string;
  leadTime: number;
  createdAt: string;
  updatedAt: string;
  supplier: {
    id: string;
    name: string;
  };
}

interface Supplier {
  id: string;
  name: string;
  status: string;
}

export default function SkuList() {
  const [items, setItems] = useState<Sku[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    supplierId: '',
    page: 1,
    pageSize: 20,
    sort: 'updatedAt:desc'
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: filters.q,
        category: filters.category,
        supplierId: filters.supplierId,
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
        sort: filters.sort
      });

      const response = await fetch(`/api/skus?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Failed to fetch SKUs:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSuppliers() {
    try {
      const response = await fetch('/api/suppliers');
      if (response.ok) {
        const data = await response.json();
        setSuppliers(data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  }

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function handleDelete(skuId: string) {
    if (confirm('Are you sure you want to delete this SKU?')) {
      try {
        const response = await fetch(`/api/skus/${skuId}`, { method: 'DELETE' });
        if (response.ok) {
          fetchData(); // Refresh the list
        } else {
          alert('Failed to delete SKU');
        }
      } catch (error) {
        alert('Failed to delete SKU');
      }
    }
  }

  return (
    <section>
      <h2>SKUs</h2>
      <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} style={{ display: 'grid', gridTemplateColumns: '1fr 200px 240px 160px 100px', gap: 12, margin: '12px 0' }}>
        <input 
          name="q" 
          placeholder="Search name/description" 
          value={filters.q}
          onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
        />
        <input 
          name="category" 
          placeholder="Category" 
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        />
        <select 
          name="supplierId" 
          value={filters.supplierId}
          onChange={(e) => setFilters(prev => ({ ...prev, supplierId: e.target.value }))}
        >
          <option value="">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">Filter</button>
          <button 
            type="button" 
            onClick={() => {
              setFilters({
                q: '',
                category: '',
                supplierId: '',
                page: 1,
                pageSize: 20,
                sort: 'updatedAt:desc'
              });
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <div style={{ overflowX: 'auto' }}>
        <table cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>SKU ID</th>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Category</th>
              <th style={{ textAlign: 'left' }}>Supplier</th>
              <th style={{ textAlign: 'right' }}>Cost</th>
              <th style={{ textAlign: 'right' }}>Lead time (days)</th>
              <th style={{ textAlign: 'left' }}>Created</th>
              <th style={{ textAlign: 'left' }}>Updated</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '20px' }}>No SKUs found</td>
              </tr>
            ) : (
              items.map((sku) => (
                <tr key={sku.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace' }}>{sku.id}</td>
                  <td>{sku.name}</td>
                  <td>{sku.category}</td>
                  <td>{sku.supplier.name}</td>
                  <td style={{ textAlign: 'right' }}>{Number(sku.cost).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{sku.leadTime}</td>
                  <td>{new Date(sku.createdAt).toLocaleString()}</td>
                  <td>{new Date(sku.updatedAt).toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <Link href={`/skus/${sku.id}/edit`} style={{ padding: '4px 8px', textDecoration: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', fontSize: '12px' }}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(sku.id)}
                        style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button 
          disabled={filters.page <= 1}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
        >
          Prev
        </button>
        <span style={{ alignSelf: 'center' }}>
          Page {filters.page} of {Math.max(1, Math.ceil(total / filters.pageSize))} ({total} items)
        </span>
        <button 
          disabled={filters.page * filters.pageSize >= total}
          onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
        >
          Next
        </button>
        <button style={{ marginLeft: 'auto' }} onClick={() => setShowCreate((v)=>!v)}>
          {showCreate ? 'Close Create' : 'Create SKU'}
        </button>
      </div>
      {showCreate && (
        <div style={{ marginTop: 16, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
          <iframe src="/skus/new" style={{ width: '100%', height: 560, border: '0' }} />
        </div>
      )}
    </section>
  );
}


