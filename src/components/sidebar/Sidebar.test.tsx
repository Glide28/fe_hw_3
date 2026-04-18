import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { useChat } from '../../app/providers/ChatProvider';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../../app/providers/ChatProvider', () => ({
  useChat: vi.fn(),
}));

const mockedUseChat = vi.mocked(useChat);
const mockedUseNavigate = vi.mocked(useNavigate);

describe('Sidebar', () => {
  const navigateMock = vi.fn();
  const setActiveChatMock = vi.fn();
  const createChatMock = vi.fn();
  const renameChatMock = vi.fn();
  const deleteChatMock = vi.fn();
  const onCloseMock = vi.fn();

  const chats = [
    {
      id: '1',
      title: 'React проект',
      messages: [
        {
          id: 'm1',
          role: 'user' as const,
          content: 'Нужно сделать sidebar',
          timestamp: '10:00',
        },
      ],
    },
    {
      id: '2',
      title: 'TypeScript задачи',
      messages: [
        {
          id: 'm2',
          role: 'assistant' as const,
          content: 'Разобрать типы и интерфейсы',
          timestamp: '11:00',
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseNavigate.mockReturnValue(navigateMock);

    mockedUseChat.mockReturnValue({
      chats,
      activeChatId: '1',
      activeChat: chats[0],
      isLoading: false,
      error: null,
      sendMessage: vi.fn(),
      createChat: createChatMock,
      setActiveChat: setActiveChatMock,
      stopGeneration: vi.fn(),
      renameChat: renameChatMock,
      deleteChat: deleteChatMock,
    });
  });

  it('при пустом поиске отображает все чаты', () => {
    render(<Sidebar isOpen={true} onClose={onCloseMock} />);

    expect(screen.getByText('React проект')).toBeInTheDocument();
    expect(screen.getByText('TypeScript задачи')).toBeInTheDocument();
  });

  it('фильтрует список чатов по названию', async () => {
    render(<Sidebar isOpen={true} onClose={onCloseMock} />);

    const input = screen.getByPlaceholderText('Поиск по чатам');

    await userEvent.type(input, 'react');

    expect(screen.getByText('React проект')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript задачи')).not.toBeInTheDocument();
  });

  it('показывает confirm при удалении чата', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Sidebar isOpen={true} onClose={onCloseMock} />);

    const deleteButtons = screen.getAllByLabelText('Удалить чат');
    await userEvent.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteChatMock).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});