import { useEffect } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useChat } from '../providers/ChatProvider';

function ChatRoute() {
  const { id } = useParams();
  const { chats, activeChatId, setActiveChat } = useChat();

  const chatExists = chats.some((chat) => chat.id === id);

  useEffect(() => {
    if (id && chatExists && activeChatId !== id) {
      setActiveChat(id);
    }
  }, [id, chatExists, activeChatId, setActiveChat]);

  if (!id || !chatExists) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />} />
      <Route path="/chat/:id" element={<ChatRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}