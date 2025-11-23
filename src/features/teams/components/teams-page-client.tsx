'use client';

import { CreateTeamForm } from './create-team-form';
import { useTeams } from '../api/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function TeamsPageClient() {
  const { data: teams, isLoading, isError } = useTeams();

  const count = teams?.length || 0;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
        <CreateTeamForm />
      </div>

      {!isLoading && !isError && (
        <p className="text-muted-foreground text-sm">
          You have {count} {count === 1 ? 'team' : 'teams'}
        </p>
      )}

      {isLoading && <p className="text-muted-foreground text-sm">Loading teams...</p>}

      {isError && <p className="text-sm text-red-500">Failed to load teams. Please try again.</p>}

      {!isLoading && !isError && (
        <>
          {teams && teams.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => {
                const card = (
                  <Card>
                    <CardHeader>
                      <CardTitle>{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
                      <span>{team.membersCount} members</span>
                      <span className="bg-secondary rounded-full px-2 py-0.5 text-xs uppercase">
                        {team.role}
                      </span>
                    </CardContent>
                  </Card>
                );

                if (!team.slug) {
                  return <div key={team.id}>{card}</div>;
                }

                return (
                  <Link key={team.id} href={`/dashboard/teams/${team.slug}`} className="block">
                    {card}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              You have no teams yet. Create the first one.
            </p>
          )}
        </>
      )}
    </section>
  );
}
