import { spawn } from 'child_process';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  const { request, userId } = await req.json();
  if (!request || typeof request !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid analysis request' }), { status: 400 });
  }

  // 사용자 설정 가져오기
  let userSettings = {};
  if (userId) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data && !error) {
        userSettings = data;
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    }
  }

  // 환경 변수와 사용자 설정을 병합
  const env = {
    ...process.env,
    ...(userSettings.openai_api_key && { OPENAI_API_KEY: userSettings.openai_api_key }),
    ...(userSettings.gemini_api_key && { GEMINI_API_KEY: userSettings.gemini_api_key }),
    ...(userSettings.serper_api_key && { SERPER_API_KEY: userSettings.serper_api_key })
  };

  const pythonProcess = spawn('python', [
    '-W', 'ignore',
    'python/data_analysis_agent.py',
    request,
  ], { env });

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