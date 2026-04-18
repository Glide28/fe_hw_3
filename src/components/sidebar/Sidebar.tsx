import { useCallback, useMemo, useState } from 'react';
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

  const chatItems = useMemo(() => {
    return chats
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
  }, [chats, normalizedQuery]);

  const handleRenameChat = useCallback((chatId: string) => {
    const currentChat = chats.find((chat) => chat.id === chatId);
    const nextTitle = window.prompt(
      'Введите новое название чата',
      currentChat?.title ?? '',
    );

    if (!nextTitle || !nextTitle.trim()) return;

    renameChat(chatId, nextTitle.trim());
  }, [chats, renameChat]);

  const handleDeleteChat = useCallback((chatId: string) => {
    const currentChat = chats.find((chat) => chat.id === chatId);
    const isConfirmed = window.confirm(
      `Удалить чат "${currentChat?.title ?? 'Без названия'}"?`,
    );

    if (!isConfirmed) return;

    deleteChat(chatId);
  }, [chats, deleteChat]);

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
    onClose();
  }, [setActiveChat, navigate, onClose]);

  const handleCreateChat = useCallback(() => {
    createChat();
    onClose();
  }, [createChat, onClose]);

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