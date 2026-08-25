import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = z.object({
  title: z.string().min(20).max(70),
  description: z.string().min(70).max(160),
  publishedAt: z.coerce.date(),
  reviewedAt: z.coerce.date(),
  audience: z.enum(['solo-game-developer', 'technical-artist', 'game-studio']),
  intent: z.enum(['learn', 'evaluate', 'compare']),
  primaryIntent: z.string().min(12),
  evidenceIds: z.array(z.string()).min(1),
  author: z.string().min(2),
  authorUrl: z.string().startsWith('/'),
  howCreated: z.string().min(20),
  cta: z.enum(['waitlist', 'studio', 'none']),
  status: z.enum(['draft', 'approved', 'published']),
});

const learn = defineCollection({
  loader: glob({ base: './src/content/learn', pattern: '**/*.md' }),
  schema: common,
});

const guides = defineCollection({
  loader: glob({ base: './src/content/guides', pattern: '**/*.md' }),
  schema: common,
});

export const collections = { learn, guides };
