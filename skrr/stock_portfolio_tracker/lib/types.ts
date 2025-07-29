import type { User as PrismaUser, PortfolioItem as PrismaPortfolioItem } from '@prisma/client';

// Re-export Prisma's generated types.
export type User = PrismaUser;
export type PortfolioItem = PrismaPortfolioItem;

/**
 * Represents a portfolio item enriched with real-time market data.
 */
export type PortfolioItemWithData = PortfolioItem & {
  currentPrice: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
};

/**
 * Represents the data structure for a stock quote from our internal API.
 */
export interface StockQuote {
  symbol: string;
  price: string; // The API returns price as a string, so we parse it later.
}
