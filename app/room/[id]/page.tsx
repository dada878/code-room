'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function RoomPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [code, setCode] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let socket: Socket | null = null;
    const init = async () => {
      const res = await fetch(`/api/room/${id}`);
      if (!res.ok) {
        router.replace('/');
        return;
      }
      fetch('/api/socket/io');
      socket = io({ path: '/api/socket/io' });
      socketRef.current = socket;

      socket.emit('join_room', { roomId: id });
      socket.on('receive_code', ({ content }) => {
        setCode(content);
      });
    };
    init();
    return () => {
      socket?.disconnect();
    };
  }, [id, router]);

  const onChange = (value?: string) => {
    const content = value || '';
    setCode(content);
    socketRef.current?.emit('code_change', { roomId: id, content });
  };

  return (
    <div className="h-screen w-screen">
      <MonacoEditor height="100%" language="javascript" value={code} onChange={onChange} />
    </div>
  );
}
