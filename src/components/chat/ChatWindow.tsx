import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { InputArea } from './InputArea';

type MessageItem = {
    id: string;
    author: string;
    text: string;
    variant: 'user' | 'assistant';
};

type ChatWindowProps = {
    chatTitle: string;
    messages: MessageItem[];
    onOpenSettings: () => void;
};

export function ChatWindow({
    chatTitle,
    messages,
    onOpenSettings,
}: ChatWindowProps) {
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

        <MessageList messages={messages} />

        <div className="chat-window__typing">
            <TypingIndicator isVisible />
        </div>

        <InputArea />
    </section>
);
}