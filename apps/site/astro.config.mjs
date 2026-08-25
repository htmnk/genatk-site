import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://example.invalid',
  integrations: [sitemap()],
});

