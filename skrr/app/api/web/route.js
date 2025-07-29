// app/api/web/route.js
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  const { prompt } = await request.json();

  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'python', 'web_builder_agent.py');
    const python = spawn('python3', [scriptPath, prompt], { env: process.env });

    let stdout = '';
    python.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('PYTHON ERROR:', data.toString());
    });

    python.on('close', () => {
      try {
        const json = JSON.parse(stdout.trim());
        resolve(NextResponse.json(json));
      } catch (err) {
        resolve(new Response('Invalid script output', { status: 500 }));
      }
    });
  });
}
