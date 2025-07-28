import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface SummaryProps {
  summary: {
    totalValue: number;
    totalInvestment: number;
    totalGainLoss: number;
    totalGainLossPercentage: number;
  };
}

export default function PortfolioSummary({ summary }: SummaryProps) {
  const gainLossColor = summary.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 평가 자산</CardTitle>
          {/* Optional: Add an icon here */}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 투자 원금</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(summary.totalInvestment)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 손익</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${gainLossColor}`}>
            {formatCurrency(summary.totalGainLoss)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 수익률</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${gainLossColor}`}>
            {formatPercentage(summary.totalGainLossPercentage)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
