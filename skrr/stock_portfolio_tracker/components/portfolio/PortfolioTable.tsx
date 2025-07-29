import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { PortfolioItemWithData } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PortfolioTableProps {
  items: PortfolioItemWithData[];
}

export default function PortfolioTable({ items }: PortfolioTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>보유 주식</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종목</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">평균 단가</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">현재가</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">평가 금액</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">손익</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수익률</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => {
                const gainLossColor = item.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600';
                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{formatCurrency(item.averagePrice)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.currentPrice > 0 ? formatCurrency(item.currentPrice) : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.currentValue > 0 ? formatCurrency(item.currentValue) : 'N/A'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${gainLossColor}`}>{formatCurrency(item.totalGainLoss)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${gainLossColor}`}>{formatPercentage(item.totalGainLossPercentage)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
