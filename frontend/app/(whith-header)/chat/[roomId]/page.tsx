'use client';

import { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
import { useParams } from 'next/navigation';
import { useAuth } from '@/store/auth-context';

const socket = io('http://localhost:8001'); // 서버 주소

export default function ChatPage() {
  const { roomId } = useParams();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // 1. 기존 메시지 불러오기 (React Query)
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8001/chat/${roomId}/messages`);
      return res.json();
    },
  });

  // 2. 실시간 메시지 수신 및 캐시 업데이트
  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('newMessage', (newMessage) => {
      // 기존 메시지 리스트에 새 메시지 추가
      queryClient.setQueryData(['messages', roomId], (old) => [
        ...(old || []),
        newMessage,
      ]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [roomId, queryClient]);

  // 스크롤 자동 이동
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. 메시지 전송
  const sendMessage = () => {
    if (!input.trim()) return;
    const msgData = { roomId, content: input, userId: user.id };

    socket.emit('sendMessage', msgData);
    setInput('');
  };

  if (isLoading) return <div>로딩 중...</div>;

  console.log('messages: ', messages);

  return (
    <div>
      <div className="chat-window">
        {messages.length !== 0 ? (
          messages.map((m, i) => (
            <div key={i}>
              <strong>{m.User?.name}:</strong> {m.content}
            </div>
          ))
        ) : (
          <p>새로운 채팅을 시작하세요</p>
        )}
        <div ref={scrollRef} />
      </div>

      {/* <div ref={scrollRef} /> */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}
