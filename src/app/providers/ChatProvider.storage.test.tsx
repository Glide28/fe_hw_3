import { render, screen, waitFor } from '@testing-library/react';
import { ChatProvider, useChat } from './ChatProvider';
import { vi } from 'vitest';

vi.mock('../../api/gigachat', () => ({
  sendChatCompletion: vi.fn(),
}));

function TestConsumer() {
  const { chats, activeChatId } = useChat();

  return (
    <div>
      <div data-testid="chat-count">{chats.length}</div>
      <div data-testid="active-chat-id">{activeChatId}</div>
      <div data-testid="first-chat-title">{chats[0]?.title ?? ''}</div>
    </div>
  );
}

describe('ChatProvider localStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('восстанавливает состояние из localStorage', () => {
    localStorage.setItem(
      'chat_app_state',
      JSON.stringify({
        chats: [
          {
            id: 'chat-1',
            title: 'Сохранённый чат',
            messages: [],
          },
        ],
        activeChatId: 'chat-1',
        isLoading: false,
      }),
    );

    render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    expect(screen.getByTestId('chat-count')).toHaveTextContent('1');
    expect(screen.getByTestId('active-chat-id')).toHaveTextContent('chat-1');
    expect(screen.getByTestId('first-chat-title')).toHaveTextContent(
      'Сохранённый чат',
    );
  });

  it('не падает на битом JSON и создаёт стартовый чат', () => {
    localStorage.setItem('chat_app_state', '{broken json');

    render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    expect(screen.getByTestId('chat-count')).toHaveTextContent('1');
    expect(screen.getByTestId('first-chat-title')).toHaveTextContent('Новый чат');
  });

  it('сохраняет состояние в localStorage после инициализации', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <ChatProvider>
        <TestConsumer />
      </ChatProvider>,
    );

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalled();
    });

    const chatStateCall = setItemSpy.mock.calls.find(
      ([key]) => key === 'chat_app_state',
    );

    expect(chatStateCall).toBeTruthy();

    const savedValue = chatStateCall?.[1];
    expect(typeof savedValue).toBe('string');

    const parsed = JSON.parse(savedValue as string);
    expect(Array.isArray(parsed.chats)).toBe(true);
    expect(parsed.chats.length).toBeGreaterThan(0);
  });
});