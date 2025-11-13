'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
});

type FormValues = z.infer<typeof schema>;

export function CreateTeamForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = (values: FormValues) => {
    // TODO: server action + optimistic update
    console.log(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
      <Input placeholder="Team name" {...form.register('name')} />
      <Button type="submit" size="sm">
        Create
      </Button>
    </form>
  );
}
