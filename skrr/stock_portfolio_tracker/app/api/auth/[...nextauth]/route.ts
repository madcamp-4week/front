import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// The handler for all NextAuth routes (e.g., /api/auth/signin, /api/auth/session)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
