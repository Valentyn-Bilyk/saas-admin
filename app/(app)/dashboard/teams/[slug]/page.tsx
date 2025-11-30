import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Membership, User, AuditLog, Team } from '@prisma/client';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type MembershipWithUser = Membership & {
  user: User | null;
};

type AuditLogWithActor = AuditLog & {
  actor: User | null;
};

type TeamWithRelations = Team & {
  memberships: MembershipWithUser[];
  auditLogs: AuditLogWithActor[];
};

export default async function TeamDetailsPage({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    return notFound();
  }

  const rawTeam = await prisma.team.findUnique({
    where: { slug },
    include: {
      memberships: {
        include: {
          user: true,
        },
      },
      auditLogs: {
        include: {
          actor: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!rawTeam) {
    return notFound();
  }
  const team = rawTeam as TeamWithRelations;
  const membersCount = team.memberships.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
        <p className="text-muted-foreground text-sm">
          {team.slug} · {membersCount} {membersCount === 1 ? 'member' : 'members'}
        </p>
      </div>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {team.memberships.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border-b pb-1 last:border-b-0 last:pb-0"
            >
              <span>{m.user?.email ?? 'Unknown user'}</span>
              <span className="bg-secondary rounded-full px-2 py-0.5 text-xs uppercase">
                {m.role}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {team.auditLogs.length === 0 && <p className="text-muted-foreground">No activity yet.</p>}

          {team.auditLogs.map((log) => (
            <div key={log.id} className="border-b pb-1 last:border-b-0 last:pb-0">
              <div className="font-medium">{log.action}</div>
              <div className="text-muted-foreground text-xs">
                {log.actor?.email ?? 'System'} · {log.createdAt.toLocaleString()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
