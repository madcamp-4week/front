import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol?.toUpperCase(); // Standardize symbol to uppercase
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.error('ALPHA_VANTAGE_API_KEY is not configured.'); // Log error on server
    return new NextResponse('API key not configured', { status: 500 });
  }

  if (!symbol) {
    return new NextResponse('Stock symbol is required', { status: 400 });
  }

  try {
    // Example using Alpha Vantage. Replace with your preferred API.
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    
    // Add caching to reduce API calls. Revalidates every 10 minutes.
    const response = await fetch(url, { next: { revalidate: 600 } });

    if (!response.ok) {
      // Log the actual error from the external API
      const errorBody = await response.text();
      console.error(`Failed to fetch stock data for ${symbol}: ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the API returned an error (e.g., invalid symbol or API limit)
    if (data['Error Message'] || !data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
      // The API can return an empty 'Global Quote' object for invalid symbols
      return new NextResponse(`Invalid symbol or API error for: ${symbol}`, { status: 404 });
    }

    const quote = data['Global Quote'];
    const price = quote['05. price'];

    if (!price) {
      return new NextResponse(`Price not found for symbol: ${symbol}`, { status: 404 });
    }

    return NextResponse.json({ symbol, price });
  } catch (error) {
    console.error(`[STOCKS_API_ERROR] for symbol ${symbol}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
