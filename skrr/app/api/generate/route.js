import { spawn } from 'child_process';

export async function POST(req) {
  const { topic } = await req.json();
  if (!topic || typeof topic !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid topic' }), { status: 400 });
  }

  const pythonProcess = spawn('python', [
    '-W', 'ignore',
    'python/blog_agent.py',
    topic,
  ], { env: process.env });

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => { stdout += data.toString(); });
  pythonProcess.stderr.on('data', (data) => { stderr += data.toString(); });

  const exitCode = await new Promise((resolve) => {
    pythonProcess.on('close', resolve);
  });

  if (exitCode !== 0) {
    try {
      const errObj = JSON.parse(stdout || '{}');
      return new Response(JSON.stringify({ error: errObj.error || 'Python error' }), { status: 500 });
    } catch {
      return new Response(JSON.stringify({ error: stderr || 'Python script failed' }), { status: 500 });
    }
  }

  try {
    const json = JSON.parse(stdout);
    return new Response(JSON.stringify(json), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON from Python' }), { status: 500 });
  }
}
