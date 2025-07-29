import { Suspense } from 'react';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioTable from '@/components/portfolio/PortfolioTable';
import AddStockModal from '@/components/portfolio/AddStockModal';
import { getPortfolioForUser } from '@/lib/portfolio';
import type { PortfolioItemWithData, StockQuote } from '@/lib/types';

// This component fetches all necessary data on the server.
async function PortfolioData() {
  const portfolioItems = await getPortfolioForUser();

  if (portfolioItems.length === 0) {
    return <p className="text-center text-gray-500 mt-8">포트폴리오가 비어있습니다. 주식을 추가해보세요.</p>;
  }

  // Fetch current prices for all stocks in parallel
  const stockQuotes: (StockQuote | null)[] = await Promise.all(
    portfolioItems.map(async (item) => {
      try {
        // The base URL should be an environment variable for production
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/stocks/${item.symbol}`, {
          // Use a short cache lifetime for price data on this page
          next: { revalidate: 300 }, // 5 minutes
        });
        if (!res.ok) return null;
        const data: StockQuote = await res.json();
        return data;
      } catch (error) {
        console.error(`Failed to fetch price for ${item.symbol}`, error);
        return null;
      }
    })
  );

  // Combine portfolio data with live market data
  const portfolioWithData: PortfolioItemWithData[] = portfolioItems.map((item) => {
    const quote = stockQuotes.find(q => q?.symbol === item.symbol);
    const currentPrice = quote ? parseFloat(quote.price) : 0;
    const currentValue = currentPrice * item.quantity;
    const totalCost = item.averagePrice * item.quantity;
    const totalGainLoss = currentValue - totalCost;
    const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

    return {
      ...item,
      currentPrice,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage,
    };
  });

  // Calculate portfolio summary
  const summary = portfolioWithData.reduce(
    (acc, item) => {
      acc.totalValue += item.currentValue;
      acc.totalInvestment += item.averagePrice * item.quantity;
      return acc;
    },
    { totalValue: 0, totalInvestment: 0 }
  );

  const totalGainLoss = summary.totalValue - summary.totalInvestment;
  const totalGainLossPercentage = summary.totalInvestment > 0 ? (totalGainLoss / summary.totalInvestment) * 100 : 0;

  const finalSummary = { ...summary, totalGainLoss, totalGainLossPercentage };

  return (
    <>
      <PortfolioSummary summary={finalSummary} />
      <div className="mt-8">
        <PortfolioTable items={portfolioWithData} />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <AddStockModal />
      </div>
      <Suspense fallback={<div className="text-center p-8">포트폴리오 로딩 중...</div>}>
        {/* @ts-expect-error Server Components are new, TS may show an error for async components. */}
        <PortfolioData />
      </Suspense>
    </div>
  );
}
