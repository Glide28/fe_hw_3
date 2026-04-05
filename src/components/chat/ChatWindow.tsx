import { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { InputArea } from './InputArea';
import { useChat } from '../../app/providers/ChatProvider';

type ChatWindowProps = {
  chatTitle: string;
  onOpenSettings: () => void;
};

export function ChatWindow({
  chatTitle,
  onOpenSettings,
}: ChatWindowProps) {
    const { activeChat, isLoading, sendMessage, stopGeneration } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  const handleSendMessage = (text: string) => {
    void sendMessage(text);
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
        <MessageList messages={activeChat?.messages ?? []} />
        <TypingIndicator isVisible={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <InputArea
        onSend={handleSendMessage}
        isLoading={isLoading}
        onStop={stopGeneration}
      />
    </section>
  );
}