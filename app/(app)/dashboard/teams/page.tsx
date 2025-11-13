import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_TEAMS = [
  { id: '1', name: 'Core Team', members: 5, role: 'Owner' },
  { id: '2', name: 'Marketing', members: 3, role: 'Admin' },
];

export default function TeamsPage() {
  // далі підмінемо на useQuery + server actions
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Teams</h1>
        <Button size="sm">Create team</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {MOCK_TEAMS.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground flex items-center justify-between text-sm">
              <span>{team.members} members</span>
              <span className="bg-secondary rounded-full px-2 py-0.5 text-xs">{team.role}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
