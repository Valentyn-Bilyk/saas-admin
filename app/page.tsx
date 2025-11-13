import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        SaaS Admin – Teams & Billing
      </h1>
      <p className="text-muted-foreground max-w-xl text-center">
        Multi-tenant адмінка з ролями, білінгом та аудит-логом. Демка для портфоліо.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </main>
  );
}
