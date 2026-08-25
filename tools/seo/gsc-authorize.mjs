import { createServer } from 'node:http';
import { chmod, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { repoRoot } from './shared.mjs';

const clientId = process.env.GSC_CLIENT_ID;
const clientSecret = process.env.GSC_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  throw new Error('Set GSC_CLIENT_ID and GSC_CLIENT_SECRET in your local shell before running this helper. Do not commit them or paste them into chat.');
}

const redirectUri = 'http://127.0.0.1:8765/oauth2/callback';
const scope = 'https://www.googleapis.com/auth/webmasters.readonly';
const output = resolve(repoRoot, '.gsc-refresh-token');
const authorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authorizeUrl.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope,
  access_type: 'offline',
  prompt: 'consent',
}).toString();

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url, redirectUri);
  if (requestUrl.pathname !== '/oauth2/callback') {
    response.writeHead(404).end('Not found');
    return;
  }
  const failure = requestUrl.searchParams.get('error');
  const code = requestUrl.searchParams.get('code');
  if (failure || !code) {
    response.writeHead(400, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<h1>Authorization was not completed</h1><p>You can close this window and run the helper again.</p>');
    server.close();
    process.exitCode = 1;
    return;
  }
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenResponse.ok) throw new Error(`Token exchange failed (${tokenResponse.status}): ${await tokenResponse.text()}`);
    const tokens = await tokenResponse.json();
    if (!tokens.refresh_token) throw new Error('Google did not return a refresh token. Revoke the app grant, then run the helper again and approve the consent screen.');
    await writeFile(output, `${tokens.refresh_token}\n`, { mode: 0o600 });
    await chmod(output, 0o600);
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<h1>GenATK Search Console authorization complete</h1><p>You can close this window. Return to the terminal for the next secure step.</p>');
    console.log(`Authorization succeeded. A local refresh-token file was created at ${output}. It is gitignored; add its value to the GSC_REFRESH_TOKEN GitHub Actions secret without pasting it into chat.`);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/html; charset=utf-8' });
    response.end('<h1>Authorization failed</h1><p>Return to the terminal for the error.</p>');
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(8765, '127.0.0.1', () => {
  console.log('Open this URL in the same browser profile that owns the GenATK Search Console property:');
  console.log(authorizeUrl.toString());
  console.log('Waiting for the local OAuth callback on http://127.0.0.1:8765 …');
});
