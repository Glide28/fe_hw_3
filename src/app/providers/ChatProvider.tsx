import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { sendChatCompletion } from '../../api/gigachat';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatState = {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
};

type ChatContextType = {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  createChat: () => void;
  setActiveChat: (chatId: string) => void;
  stopGeneration: () => void;
  renameChat: (chatId: string, title: string) => void;
  deleteChat: (chatId: string) => void;
};

type ChatAction =
  | { type: 'CREATE_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'RENAME_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'SET_LOADING'; payload: boolean };

const STORAGE_KEY = 'chat_app_state';

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getCurrentTime = (): string =>
  new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

const createEmptyState = (): ChatState => {
  const initialChatId = generateId();

  return {
    chats: [
      {
        id: initialChatId,
        title: 'Новый чат',
        messages: [],
      },
    ],
    activeChatId: initialChatId,
    isLoading: false,
  };
};

const generateChatTitle = (text: string): string => {
  const trimmed = text.trim();

  if (trimmed.length < 3) {
    return 'Новый чат';
  }

  return trimmed.length > 40
    ? `${trimmed.slice(0, 40)}...`
    : trimmed;
};

const loadState = (): ChatState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createEmptyState();
    }

    const parsed = JSON.parse(raw) as ChatState;

    if (!parsed || !Array.isArray(parsed.chats) || parsed.chats.length === 0) {
      return createEmptyState();
    }

    return {
      chats: parsed.chats,
      activeChatId: parsed.activeChatId ?? parsed.chats[0]?.id ?? null,
      isLoading: false,
    };
  } catch {
    return createEmptyState();
  }
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'CREATE_CHAT': {
      const newChat: Chat = {
        id: action.payload.chatId,
        title: action.payload.title,
        messages: [],
      };

      return {
        ...state,
        chats: [newChat, ...state.chats],
        activeChatId: newChat.id,
      };
    }

    case 'SET_ACTIVE_CHAT': {
      return {
        ...state,
        activeChatId: action.payload.chatId,
      };
    }

    case 'ADD_MESSAGE': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message],
              }
            : chat,
        ),
      };
    }

    case 'RENAME_CHAT': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? { ...chat, title: action.payload.title }
            : chat,
        ),
      };
    }

    case 'DELETE_CHAT': {
      const remainingChats = state.chats.filter(
        (chat) => chat.id !== action.payload.chatId,
      );

      if (remainingChats.length === 0) {
        const fallbackState = createEmptyState();
        return {
          ...fallbackState,
          isLoading: false,
        };
      }

      const isDeletingActiveChat = state.activeChatId === action.payload.chatId;

      return {
        ...state,
        chats: remainingChats,
        activeChatId: isDeletingActiveChat
          ? remainingChats[0].id
          : state.activeChatId,
      };
    }

    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }

    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, undefined, loadState);

  const activeChat =
    state.chats.find((chat) => chat.id === state.activeChatId) ?? null;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createChat = () => {
    const chatId = generateId();

    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        chatId,
        title: 'Новый чат',
      },
    });
  };

  const setActiveChat = (chatId: string) => {
    dispatch({
      type: 'SET_ACTIVE_CHAT',
      payload: { chatId },
    });
  };

  const renameChat = (chatId: string, title: string) => {
    dispatch({
      type: 'RENAME_CHAT',
      payload: { chatId, title },
    });
  };

  const deleteChat = (chatId: string) => {
    dispatch({
      type: 'DELETE_CHAT',
      payload: { chatId },
    });
  };

  const stopGeneration = () => {
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || state.isLoading || !state.activeChatId) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: getCurrentTime(),
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        chatId: state.activeChatId,
        message: userMessage,
      },
    });

    const currentChatBeforeSend = state.chats.find(
      (chat) => chat.id === state.activeChatId,
    );

    if (currentChatBeforeSend && currentChatBeforeSend.messages.length === 0) {
      dispatch({
        type: 'RENAME_CHAT',
        payload: {
          chatId: state.activeChatId,
          title: generateChatTitle(trimmed),
        },
      });
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const currentChat = state.chats.find(
        (chat) => chat.id === state.activeChatId,
      );

      const apiMessages = [
        { role: 'system' as const, content: 'Ты полезный ассистент' },
        ...(currentChat?.messages ?? []).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        {
          role: 'user' as const,
          content: trimmed,
        },
      ];

      const response = await sendChatCompletion(apiMessages);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: getCurrentTime(),
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId: state.activeChatId,
          message: assistantMessage,
        },
      });
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Ошибка при запросе к GigaChat',
        timestamp: getCurrentTime(),
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          chatId: state.activeChatId,
          message: errorMessage,
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats: state.chats,
        activeChatId: state.activeChatId,
        activeChat,
        isLoading: state.isLoading,
        sendMessage,
        createChat,
        setActiveChat,
        stopGeneration,
        renameChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used inside ChatProvider');
  }

  return context;
};