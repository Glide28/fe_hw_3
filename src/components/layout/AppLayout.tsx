import { useMemo, useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import { EmptyState } from '../chat/EmptyState';

type ChatItem = {
    id: string;
    title: string;
    lastMessageDate: string;
};

type MessageItem = {
    id: string;
    author: string;
    text: string;
    variant: 'user' | 'assistant';
};

export function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedChatId, setSelectedChatId] = useState('1');

    const chats: ChatItem[] = useMemo(
        () => [
            {
                id: '1',
                title: 'Новый диалог про React и TypeScript с очень длинным названием',
                lastMessageDate: '09.03.2026',
            },
            {
                id: '2',
                title: 'Обсуждение вёрстки и адаптивности',
                lastMessageDate: '08.03.2026',
            },
            {
                id: '3',
                title: 'Домашнее задание по middleware',
                lastMessageDate: '07.03.2026',
            },
            {
                id: '4',
                title: 'Подготовка к итоговому проекту',
                lastMessageDate: '06.03.2026',
            },
            {
                id: '5',
                title: 'Тестирование интерфейса чата',
                lastMessageDate: '05.03.2026',
            },
        ],
        []
    );

    const messages: MessageItem[] = useMemo(
        () => [
            {
                id: '1',
                author: 'Пользователь',
                variant: 'user',
                text: 'Привет! Помоги сделать **чат-интерфейс** на React.',
            },
            {
                id: '2',
                author: 'GigaChat',
                variant: 'assistant',
                text: 'Конечно! Предлагаю разбить проект на компоненты:\n\n- Sidebar\n- ChatWindow\n- SettingsPanel',
            },
            {
                id: '3',
                author: 'Пользователь',
                variant: 'user',
                text: 'Нужна ещё поддержка `markdown` в сообщениях.',
            },
            {
                id: '4',
                author: 'GigaChat',
                variant: 'assistant',
                text: 'Для этого подключите библиотеку:\n\n```bash\nnpm install react-markdown\n```',
            },
            {
                id: '5',
                author: 'Пользователь',
                variant: 'user',
                text: 'И тёмная тема тоже обязательна.',
            },
            {
                id: '6',
                author: 'GigaChat',
                variant: 'assistant',
                text: 'Тогда используйте CSS-переменные и переключатель темы.',
            },
        ],
        []
    );

    const activeChat = chats.find((chat) => chat.id === selectedChatId) || null;

    return (
        <div className="app-shell" data-theme={theme}>
            <button
                className="burger-button"
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Открыть боковую панель"
            >
                ☰
            </button>

            <Sidebar
                chats={chats}
                activeChatId={selectedChatId}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={(chatId) => {
                setSelectedChatId(chatId);
                setIsSidebarOpen(false);
                }}
            />

            <main className="main-content">
                {activeChat ? (
                    <ChatWindow
                        chatTitle={activeChat.title}
                        messages={messages}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                ) : (
                    <EmptyState />
                )}
            </main>

            <SettingsPanel
                isOpen={isSettingsOpen}
                theme={theme}
                onClose={() => setIsSettingsOpen(false)}
                onThemeChange={setTheme}
            />
        </div>
    );
}