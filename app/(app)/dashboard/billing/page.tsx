// app/(app)/dashboard/billing/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BillingPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            <span className="text-foreground font-medium">Pro</span> – $29/month
          </p>
          <p>
            Status: <span className="text-foreground font-medium">Active</span>
          </p>
          <Button size="sm" className="mt-2">
            Manage subscription
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
