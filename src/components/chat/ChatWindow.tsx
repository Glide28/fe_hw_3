import { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { InputArea } from './InputArea';
import { useChat } from '../../app/providers/ChatProvider';
import { ErrorBoundary } from '../ErrorBoundary';

type ChatWindowProps = {
  chatTitle: string;
  onOpenSettings: () => void;
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  repetitionPenalty: number;
};

export function ChatWindow({
  chatTitle,
  onOpenSettings,
  model,
  temperature,
  topP,
  maxTokens,
  systemPrompt,
  repetitionPenalty,
}: ChatWindowProps) {
  const { activeChat, isLoading, error, sendMessage, stopGeneration } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  const handleSendMessage = (text: string) => {
    void sendMessage(text, {
      model,
      temperature,
      topP,
      maxTokens,
      systemPrompt,
      repetitionPenalty,
    });
  };

  const handleRetry = () => {
    const lastUserMessage = [...(activeChat?.messages ?? [])]
      .reverse()
      .find((message) => message.role === 'user');

    if (!lastUserMessage) return;

    void sendMessage(lastUserMessage.content, {
      model,
      temperature,
      topP,
      maxTokens,
      systemPrompt,
      repetitionPenalty,
    });
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
        <ErrorBoundary>
          <MessageList messages={activeChat?.messages ?? []} />
        </ErrorBoundary>
        <TypingIndicator isVisible={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      <InputArea
        onSend={handleSendMessage}
        isLoading={isLoading}
        onStop={stopGeneration}
        error={error}
        onRetry={handleRetry}
      />
    </section>
  );
}