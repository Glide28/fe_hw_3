import { useEffect, useRef, useState } from 'react';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { InputArea } from './InputArea';
import type { Message } from '../../types/message';

type ChatWindowProps = {
    chatTitle: string;
    onOpenSettings: () => void;
};

const initialMessages: Message[] = [
    {
        id: '1',
        role: 'user',
        content: 'Привет! Помоги сделать **чат-интерфейс** на React.',
        timestamp: '10:00',
    },
    {
        id: '2',
        role: 'assistant',
        content:
            'Конечно! Предлагаю разбить проект на компоненты:\n\n- Sidebar\n- ChatWindow\n- SettingsPanel',
        timestamp: '10:01',
    },
    {
        id: '3',
        role: 'user',
        content: 'Нужна ещё поддержка `markdown` в сообщениях.',
        timestamp: '10:02',
    },
    {
        id: '4',
        role: 'assistant',
        content:
            'Для этого подключите библиотеку:\n\n```bash\nnpm install react-markdown\n```',
        timestamp: '10:03',
    },
    {
        id: '5',
        role: 'user',
        content: 'И тёмная тема тоже обязательна.',
        timestamp: '10:04',
    },
    {
        id: '6',
        role: 'assistant',
        content: 'Тогда используйте CSS-переменные и переключатель темы.',
        timestamp: '10:05',
    },
];

export function ChatWindow({
    chatTitle,
    onOpenSettings,
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getCurrentTime = (): string =>
        new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

    const generateId = (): string =>
        `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const getMockAssistantReply = (userText: string): string => {
        const normalized = userText.toLowerCase();

        if (normalized.includes('react')) {
            return 'Для управления состоянием здесь лучше использовать `useState`, а для автоскролла — `useRef` + `useEffect`.';
        }

        if (normalized.includes('typescript')) {
            return 'Не забудьте вынести тип `Message` в отдельный файл `src/types/message.ts`.';
        }

        if (normalized.includes('привет')) {
            return 'Привет! Я готов помочь с домашним заданием по React.';
        }

        if (normalized.includes('тема')) {
            return 'Для светлой и тёмной темы удобно использовать CSS-переменные и переключение `data-theme` на корневом элементе.';
        }

        return 'Это моковый ответ ассистента. Здесь позже можно будет подключить реальный API.';
    };

    const handleSendMessage = (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: text,
            timestamp: getCurrentTime(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        const delay = 1000 + Math.floor(Math.random() * 1000);

        timeoutRef.current = window.setTimeout(() => {
            const assistantMessage: Message = {
                id: generateId(),
                role: 'assistant',
                content: getMockAssistantReply(text),
                timestamp: getCurrentTime(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsLoading(false);
            timeoutRef.current = null;
        }, delay);
    };

    const handleStopGeneration = () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setIsLoading(false);
    };

    return (
        <section className="chat-window">
            <header className="chat-window__header">
                <div className="chat-window__title-wrap">
                    <h1 className="chat-window__title">{chatTitle}</h1>
                </div>

                <button
                    type="button"
                    className="icon-button"
                    aria-label="Открыть настройки"
                    onClick={onOpenSettings}
                >
                    ⚙
                </button>
            </header>

            <div className="message-list">
                <MessageList messages={messages} />
                <TypingIndicator isVisible={isLoading} />
                <div ref={messagesEndRef} />
            </div>

            <InputArea
                onSend={handleSendMessage}
                isLoading={isLoading}
                onStop={handleStopGeneration}
            />
        </section>
    );
}