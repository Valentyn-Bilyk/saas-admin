// src/features/teams/api/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Path } from 'react-hook-form';

type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export type TeamDto = {
  id: string;
  name: string;
  slug: string;
  membersCount: number;
  role: Role;
};

type ApiTeam = {
  id: string;
  name: string;
  slug: string;
  memberships?: {
    role: Role;
  }[];
};

type TeamsResponse = {
  teams?: ApiTeam[];
};

async function fetchTeams(): Promise<TeamDto[]> {
  const res = await fetch('/api/teams', { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to load teams');
  }

  const data: TeamsResponse = await res.json();

  return (data.teams ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    membersCount: t.memberships?.length ?? 0,
    role: (t.memberships?.[0]?.role as Role) ?? 'MEMBER',
  }));
}

async function createTeamApi(payload: { name: string }): Promise<TeamDto> {
  const res = await fetch('/api/teams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error ?? 'Failed to create team';
    throw new Error(message);
  }

  const data = await res.json();
  const t = data.team;

  const team: TeamDto = {
    id: t.id,
    name: t.name,
    slug: t.slug,
    membersCount: 1,
    role: 'OWNER',
  };

  return team;
}

export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeamApi,
    // optimistic updates
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['teams'] });

      const previous = queryClient.getQueryData<TeamDto[]>(['teams']);

      const optimisticTeam: TeamDto = {
        id: `optimistic-${Date.now()}`,
        name: variables.name,
        slug: '',
        membersCount: 1,
        role: 'OWNER',
      };

      queryClient.setQueryData<TeamDto[]>(['teams'], (old) =>
        old ? [optimisticTeam, ...old] : [optimisticTeam],
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['teams'], context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<TeamDto[]>(['teams'], (current) => {
        if (!current || current.length === 0) return [data];

        return current.map((team) => (team.id.startsWith('optimistic-') ? data : team));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}
