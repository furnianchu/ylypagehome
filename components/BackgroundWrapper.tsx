'use client';
import { useEffect, useRef, useState } from 'react';

const VIDEO_LIST = [
  '/videos/1.mp4',
  '/videos/2.mp4',
  '/videos/3.mp4',
  '/videos/4.mp4',
  '/videos/5.mp4',
  '/videos/6.mp4',
  '/videos/7.mp4',
  '/videos/8.mp4',
  '/videos/9.mp4',
];

function pickByMode(mode: string): string {
  const now = Date.now();
  switch (mode) {
    case 'random':
      return VIDEO_LIST[Math.floor(Math.random() * VIDEO_LIST.length)];
    case '7days':
      return VIDEO_LIST[Math.floor(now / 604800000) % VIDEO_LIST.length];
    case '14days':
      return VIDEO_LIST[Math.floor(now / 1209600000) % VIDEO_LIST.length];
    case '30days':
      return VIDEO_LIST[Math.floor(now / 2592000000) % VIDEO_LIST.length];
    default: // daily
      return VIDEO_LIST[Math.floor(now / 86400000) % VIDEO_LIST.length];
  }
}

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [videoSrc, setVideoSrc] = useState(VIDEO_LIST[0]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 优先使用环境变量，其次 localStorage（方便调试），最后默认 daily
    const mode = process.env.NEXT_PUBLIC_BG_MODE || localStorage.getItem('bg-mode') || 'daily';
    setVideoSrc(pickByMode(mode));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  return (
    <div className="relative min-h-screen overflow-hidden z-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-20"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
