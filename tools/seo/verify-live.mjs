const siteUrl = process.env.SITE_URL;
if (!siteUrl) {
  console.log('Live verification skipped: SITE_URL is not configured.');
  process.exit(0);
}
const normalized = siteUrl.replace(/\/$/, '');
const urls = [normalized, `${normalized}/about/`, `${normalized}/learn/`, `${normalized}/guides/`, `${normalized}/robots.txt`, `${normalized}/sitemap-index.xml`];
const errors = [];
let sitemap = '';
for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: 'error' });
    if (!response.ok) errors.push(`${url}: expected 2xx, got ${response.status}`);
    else {
      if (url.endsWith('/sitemap-index.xml')) sitemap = await response.text();
      console.log(`${url}: ${response.status}`);
    }
  } catch (error) {
    errors.push(`${url}: ${error.message}`);
  }
}
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).filter((url) => url.startsWith(normalized));
for (const url of sitemapLocations) {
  try {
    const response = await fetch(url, { redirect: 'error' });
    const html = await response.text();
    if (!response.ok) errors.push(`${url}: sitemap URL returned ${response.status}`);
    if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${url}: missing rendered title.`);
    if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${url}: missing rendered description.`);
    if (!/<link rel="canonical" href="[^"]+"/.test(html)) errors.push(`${url}: missing rendered canonical.`);
    if (!/<h1(?:\s[^>]*)?>/.test(html)) errors.push(`${url}: missing rendered H1.`);
  } catch (error) {
    errors.push(`${url}: ${error.message}`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
