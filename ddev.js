#!/usr/bin/env node
/*async function httpStatus(url, timeout = 10000) {
  return new Promise(resolve => {
    const req = http.get(url, { timeout }, res => {
      resolve(res.statusCode);
      res.resume();
    });
    req.on('timeout', () => { 
      req.destroy(); 
      console.error(`Timeout checking ${url}`);
      resolve(null); 
    });
    req.on('error', (err) => {
      console.error(`Error checking ${url}:`, err.message);
      resolve(null);
    });
  });
}s — simple ddev-like orchestration for dev
  Usage:
    node ddev.js start   # docker compose up -d + health checks
    node ddev.js stop    # docker compose down
    node ddev.js clean   # docker compose down -v
    node ddev.js status  # print service health
*/

const { spawn } = require('child_process');
const http = require('http');

function sh(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: false, ...opts });
    p.on('close', code => {
      if (code === 0) resolve(); else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`));
    });
    p.on('error', reject);
  });
}

function httpStatus(url, timeout = 2000) {
  return new Promise(resolve => {
    const req = http.get(url, { timeout }, res => {
      resolve(res.statusCode);
      res.resume();
    });
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

async function waitFor(url, ok = 200, maxMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const code = await httpStatus(url);
    if (code === ok) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

async function main() {
  const cmd = process.argv[2] || 'start';
  const isWin = process.platform === 'win32';
  const compose = isWin ? 'docker' : 'docker';
  const composeArgs = ['compose'];

  if (cmd === 'start') {
    if (!process.env.JWT_SECRET_KEY) {
      process.env.JWT_SECRET_KEY = 'dev-secret-THIS-IS-DEV-ONLY-12345678901234567890';
      console.log('[ddev] Using dev JWT secret (set JWT_SECRET_KEY to override).');
    }
    console.log('[ddev] docker compose up --build -d');
    await sh(compose, [...composeArgs, 'up', '--build', '-d']);
    console.log('[ddev] Waiting for services...');
    const okBackend = await waitFor('http://localhost:8000/health');
    const okNodeRed = await waitFor('http://localhost:1880/health');
    const okFrontend = await waitFor('http://localhost:3000');
    console.log(`[ddev] backend: ${okBackend ? 'OK' : 'WAIT'}`);
    console.log(`[ddev] node-red: ${okNodeRed ? 'OK' : 'WAIT'}`);
    console.log(`[ddev] frontend: ${okFrontend ? 'OK' : 'WAIT'}`);
    if (!okBackend || !okNodeRed || !okFrontend) {
      console.log('[ddev] Some services not healthy yet; they may still be building. Logs: docker compose logs -f');
    } else {
      console.log('[ddev] All services healthy.');
    }
    return;
  }

  if (cmd === 'stop') {
    console.log('[ddev] docker compose down');
    await sh(compose, [...composeArgs, 'down']);
    return;
  }

  if (cmd === 'clean') {
    console.log('[ddev] docker compose down -v');
    await sh(compose, [...composeArgs, 'down', '-v']);
    return;
  }

  if (cmd === 'status') {
    const b = await httpStatus('http://localhost:8000/health');
    const n = await httpStatus('http://localhost:1880/health');
    const f = await httpStatus('http://localhost:3000');
    console.log(JSON.stringify({ backend: b, nodeRed: n, frontend: f }, null, 2));
    return;
  }

  console.log('Usage: node ddev.js [start|stop|clean|status]');
  process.exit(1);
}

main().catch(err => { console.error(err.message || err); process.exit(1); });
