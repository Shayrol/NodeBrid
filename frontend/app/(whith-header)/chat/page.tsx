'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8001');

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('chat', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat');
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('chat', message);
    setMessage('');
  };

  return (
    <div>
      <h1>채팅 TEST</h1>

      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}
