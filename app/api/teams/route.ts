import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createTeamSchema = z.object({
  name: z.string().min(2),
});

async function ensureDemoUser() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  return user;
}

async function generateUniqueSlug(base: string) {
  const slugBase = base || 'team';
  let slug = slugBase;
  let counter = 1;

  while (true) {
    const existing = await prisma.team.findUnique({
      where: { slug },
    });

    if (!existing) return slug;

    slug = `${slugBase}-${counter++}`;
  }
}

export async function GET() {
  const user = await ensureDemoUser();

  const teams = await prisma.team.findMany({
    where: {
      memberships: {
        some: { userId: user.id },
      },
    },
    include: { memberships: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ teams });
}

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = createTeamSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid data',
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { name } = parsed.data;

  const user = await ensureDemoUser();

  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const slug = await generateUniqueSlug(baseSlug);
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const team = await prisma.$transaction(async (tx: any) => {
    const t = await tx.team.create({
      data: {
        name,
        slug,
        ownerId: user.id,
      },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        teamId: t.id,
        role: 'OWNER',
      },
    });

    await tx.auditLog.create({
      data: {
        teamId: t.id,
        actorId: user.id,
        action: 'team.created',
        meta: { name },
      },
    });

    return t;
  });

  return NextResponse.json({ team }, { status: 201 });
}
