import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getPortfolioForUser } from '@/lib/portfolio';

// GET all portfolio items for the logged-in user
export async function GET(req: NextRequest) {
  try {
    // Session check is handled within getPortfolioForUser, but an extra check here is good practice for API routes.
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const portfolioItems = await getPortfolioForUser();
    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error('[PORTFOLIO_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// POST a new stock to the user's portfolio
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    // Add basic validation for types
    const { symbol, quantity, averagePrice } = body;

    if (!symbol || typeof quantity !== 'number' || typeof averagePrice !== 'number') {
      return new NextResponse('Missing or invalid required fields', { status: 400 });
    }

    const newStock = await db.portfolioItem.create({
      data: {
        symbol: symbol.toUpperCase(), // Store symbol in a consistent format
        quantity,
        averagePrice,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newStock, { status: 201 });
  } catch (error) {
    console.error('[PORTFOLIO_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
