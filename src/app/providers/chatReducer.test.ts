import { chatReducer } from './ChatProvider';

describe('chatReducer', () => {
  const initialState = {
    chats: [
      {
        id: '1',
        title: 'Тест чат',
        messages: [],
      },
    ],
    activeChatId: '1',
    isLoading: false,
  };

  it('CREATE_CHAT добавляет новый чат', () => {
    const state = chatReducer(initialState, {
      type: 'CREATE_CHAT',
      payload: { chatId: '2', title: 'Новый чат' },
    });

    expect(state.chats.length).toBe(2);
    expect(state.chats[0].id).toBe('2');
    expect(state.activeChatId).toBe('2');
  });

  it('ADD_MESSAGE добавляет сообщение', () => {
    const message = {
      id: 'm1',
      role: 'user',
      content: 'Привет',
      timestamp: '10:00',
    };

    const state = chatReducer(initialState, {
      type: 'ADD_MESSAGE',
      payload: { chatId: '1', message },
    });

    expect(state.chats[0].messages.length).toBe(1);
    expect(state.chats[0].messages[0].content).toBe('Привет');
  });

  it('RENAME_CHAT меняет название', () => {
    const state = chatReducer(initialState, {
      type: 'RENAME_CHAT',
      payload: { chatId: '1', title: 'Новое имя' },
    });

    expect(state.chats[0].title).toBe('Новое имя');
  });

  it('DELETE_CHAT удаляет чат', () => {
    const state = chatReducer(
      {
        chats: [
          { id: '1', title: 'A', messages: [] },
          { id: '2', title: 'B', messages: [] },
        ],
        activeChatId: '1',
        isLoading: false,
      },
      {
        type: 'DELETE_CHAT',
        payload: { chatId: '1' },
      },
    );

    expect(state.chats.length).toBe(1);
    expect(state.chats[0].id).toBe('2');
  });

  it('DELETE_CHAT переключает activeChat при удалении активного', () => {
    const state = chatReducer(
      {
        chats: [
          { id: '1', title: 'A', messages: [] },
          { id: '2', title: 'B', messages: [] },
        ],
        activeChatId: '1',
        isLoading: false,
      },
      {
        type: 'DELETE_CHAT',
        payload: { chatId: '1' },
      },
    );

    expect(state.activeChatId).toBe('2');
  });

  it('SET_LOADING работает корректно', () => {
    const state = chatReducer(initialState, {
      type: 'SET_LOADING',
      payload: true,
    });

    expect(state.isLoading).toBe(true);
  });
});