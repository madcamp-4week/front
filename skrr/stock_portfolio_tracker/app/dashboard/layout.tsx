import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect all routes under /dashboard
  const session = await getAuthSession();

  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard'); // Redirect with a callback URL
  }

  return <>{children}</>;
}
