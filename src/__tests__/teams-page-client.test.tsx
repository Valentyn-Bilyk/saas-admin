import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamsPageClient } from '../features/teams/components/teams-page-client';
import { useTeams, useCreateTeam } from '../features/teams/api/hooks';

vi.mock('../features/teams/api/hooks', () => ({
  useTeams: vi.fn(),
  useCreateTeam: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

describe('TeamsPageClient', () => {
  it('renders counter and team cards', () => {
    const mockedUseTeams = useTeams as unknown as ReturnType<typeof vi.fn>;

    mockedUseTeams.mockReturnValue({
      data: [
        {
          id: '1',
          name: 'Core Team',
          slug: 'core-team',
          membersCount: 3,
          role: 'OWNER',
        },
        {
          id: '2',
          name: 'Ops',
          slug: 'ops',
          membersCount: 5,
          role: 'ADMIN',
        },
      ],
      isLoading: false,
      isError: false,
    });

    render(<TeamsPageClient />);

    expect(screen.getByText('You have 2 teams')).toBeInTheDocument();
    expect(screen.getByText('Core Team')).toBeInTheDocument();
    expect(screen.getByText('Ops')).toBeInTheDocument();
  });
});
