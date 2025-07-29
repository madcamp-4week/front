import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Fetches the portfolio for the currently authenticated user.
 * This logic is shared between server components and API routes.
 * @returns {Promise<PortfolioItem[]>} A promise that resolves to the user's portfolio items.
 */
export async function getPortfolioForUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Return empty array if no user is found or not authenticated.
    // This is a safe default for rendering components.
    return [];
  }

  const portfolioItems = await db.portfolioItem.findMany({
    where: { userId: session.user.id },
    orderBy: {
      createdAt: 'asc', // Order by creation date
    },
  });

  return portfolioItems;
}
