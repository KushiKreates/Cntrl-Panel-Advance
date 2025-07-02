import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // adjust paths as needed
import { Button } from '@/components/ui/button';
import Http from '@/lib/Http'; // adjust path as needed

interface Product {
  id: string;
  type: string;
  price: number;
  quantity: number;
  description: string;
  currency_code: string;
  disabled: number;
  created_at: string;
  updated_at: string;
  display: string;
}

interface StoreApiResponse {
  success: boolean;
  data: {
    products: Product[];
  };
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Http.get<StoreApiResponse>('/api/store')
      .then((response) => {
        if (response.success) {
          setProducts(response.data.products);
        } else {
          setError('Failed to load products.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('An error occurred while fetching store data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="shadow">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              {product.display} {product.type}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{product.description}</p>
            <p className="mt-2 text-sm">
              Price: {product.price} {product.currency_code}
            </p>
            <p className="mt-2 text-sm">
              Credits Added: {product.quantity}
            </p>
            <Button className="mt-4" disabled={!!product.disabled}>
              {product.disabled ? 'Unavailable' : 'Buy Now'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Store;