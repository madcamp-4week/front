// app/page.tsx
'use client';

import { useState, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      const duration = audioBlob.size / 1000;
      const estimatedScore = duration > 8000 ? 85 : duration > 5000 ? 70 : 40;
      setScore(Math.floor(estimatedScore));
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <Head>
        <title>쇼미더AI</title>
      </Head>
      <h1 className="text-4xl md:text-6xl font-bold mb-10">쇼미더AI 🎤</h1>

      {!score ? (
        <div className="w-full max-w-xl bg-zinc-900 p-6 rounded-xl shadow-xl text-center">
          <label className="block mb-4">
            <span className="block mb-2 text-lg">닉네임</span>
            <input
              className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 text-white"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 랩천재광호"
            />
          </label>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full py-3 rounded font-bold text-lg transition-all ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isRecording ? '🛑 녹음 중지' : '🎙️ 랩 시작'}
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-2xl mb-4">🎤 {nickname}, 당신의 점수는...</p>
          <p className="text-5xl font-bold mb-6">{score}점</p>
          <p className="text-lg">
            {score >= 70 ? '🔥 예선 통과! 당신은 진짜입니다.' : '😢 탈락... 다음 기회를 노려보세요.'}
          </p>
          {audioUrl && <audio controls src={audioUrl} className="mt-4" />}

          <button
            className="mt-6 px-6 py-2 bg-zinc-700 hover:bg-zinc-600 rounded"
            onClick={() => {
              setScore(null);
              setNickname('');
              setAudioUrl(null);
            }}
          >
            다시하기
          </button>
        </div>
      )}
    </main>
  );
}