import { mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

const url = process.env.LIGHTHOUSE_URL || 'http://127.0.0.1:4321/learn/deterministic-procedural-assets/';
const report = resolve('marketing/reports/lighthouse-cottage-seed-study.json');
const chromePath = await puppeteer.executablePath();
await mkdir(resolve('marketing/reports'), { recursive: true });
const args = [
  resolve('node_modules/lighthouse/cli/index.js'), url,
  '--output=json', `--output-path=${report}`, '--only-categories=performance',
  '--chrome-flags=--headless=new --no-sandbox', '--quiet',
];
const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  env: { ...process.env, CHROME_PATH: chromePath },
});
await new Promise((resolvePromise, reject) => child.once('exit', (code) => code === 0 ? resolvePromise() : reject(new Error(`Lighthouse exited with ${code}.`))));
console.log(`Lighthouse report written to ${report}`);
