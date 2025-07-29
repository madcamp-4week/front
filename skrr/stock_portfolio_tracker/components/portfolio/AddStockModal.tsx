'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

// This is a simplified version. A real modal would use a dialog library like Radix.
export default function AddStockModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol.toUpperCase(),
          quantity: parseInt(quantity, 10),
          averagePrice: parseFloat(price),
        }),
      });

      if (!response.ok) {
        throw new Error('주식 추가에 실패했습니다. 입력값을 확인해주세요.');
      }

      // Reset form and close modal on success
      setIsOpen(false);
      setSymbol('');
      setQuantity('');
      setPrice('');
      router.refresh(); // Refresh server components to show the new stock
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return <Button onClick={() => setIsOpen(true)}>주식 추가</Button>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">새 주식 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <div>
            <label htmlFor="symbol" className="text-sm font-medium">종목코드 (Symbol)</label>
            <Input id="symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <label htmlFor="quantity" className="text-sm font-medium">수량</label>
            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" className="mt-1" />
          </div>
          <div>
            <label htmlFor="price" className="text-sm font-medium">평균 매수 단가</label>
            <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" className="mt-1" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>취소</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? '추가 중...' : '추가하기'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
