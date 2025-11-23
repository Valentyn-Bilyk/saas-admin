'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateTeam } from '../api/hooks';

const schema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
});

type FormValues = z.infer<typeof schema>;

export function CreateTeamForm() {
  const { mutateAsync, isPending } = useCreateTeam();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await mutateAsync({ name: values.name });
      form.reset();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
      <Input placeholder="Team name" {...form.register('name')} disabled={isPending} />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create team'}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
