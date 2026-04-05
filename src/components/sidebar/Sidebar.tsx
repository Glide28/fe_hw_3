import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ChatList } from './ChatList';
import { SearchInput } from './SearchInput';
import { useChat } from '../../app/providers/ChatProvider';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    chats,
    activeChatId,
    setActiveChat,
    createChat,
    renameChat,
    deleteChat,
  } = useChat();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const chatItems = chats
    .filter((chat) => {
      if (!normalizedQuery) return true;

      const titleMatches = chat.title.toLowerCase().includes(normalizedQuery);
      const lastMessage = chat.messages.at(-1)?.content.toLowerCase() ?? '';
      const lastMessageMatches = lastMessage.includes(normalizedQuery);

      return titleMatches || lastMessageMatches;
    })
    .map((chat) => ({
      id: chat.id,
      title: chat.title,
      lastMessageDate: chat.messages.at(-1)?.timestamp ?? 'Нет сообщений',
    }));

  const handleRenameChat = (chatId: string) => {
    const currentChat = chats.find((chat) => chat.id === chatId);
    const nextTitle = window.prompt(
      'Введите новое название чата',
      currentChat?.title ?? '',
    );

    if (!nextTitle || !nextTitle.trim()) return;

    renameChat(chatId, nextTitle.trim());
  };

  const handleDeleteChat = (chatId: string) => {
    const currentChat = chats.find((chat) => chat.id === chatId);
    const isConfirmed = window.confirm(
      `Удалить чат "${currentChat?.title ?? 'Без названия'}"?`,
    );

    if (!isConfirmed) return;

    deleteChat(chatId);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
    onClose();
  };

  const handleCreateChat = () => {
    createChat();
    onClose();
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <Button variant="primary" fullWidth onClick={handleCreateChat}>
            <span className="button__icon">＋</span>
            Новый чат
          </Button>

          <SearchInput
            placeholder="Поиск по чатам"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <ChatList
          chats={chatItems}
          activeChatId={activeChatId ?? ''}
          onSelectChat={handleSelectChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
        />
      </aside>

      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  );
}