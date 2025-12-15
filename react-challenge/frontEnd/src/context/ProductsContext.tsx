import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Review = {
  reviewer: string;
  rating: number;
  comment: string;
};

export type Product = {
  id: number;
  name: string;
  reviews: Review[];
};

export type ReviewInput = {
  reviewer: string;
  rating: number;
  comment: string;
};

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addReview: (productId: number, input: ReviewInput) => Promise<void>;
  submitting: Record<number, boolean>;
};

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<Record<number, boolean>>({});

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) {
        throw new Error(`Failed to load products (${res.status})`);
      }
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const addReview = async (productId: number, input: ReviewInput) => {
    setSubmitting((prev) => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        const message = errorBody?.message ?? `Failed to submit review (${res.status})`;
        throw new Error(Array.isArray(errorBody?.errors) ? errorBody.errors.join(' ') : message);
      }

      // refresh to get latest reviews
      await refresh();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to submit review');
    } finally {
      setSubmitting((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const value = useMemo(
    () => ({ products, loading, error, refresh, addReview, submitting }),
    [products, loading, error, submitting],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
