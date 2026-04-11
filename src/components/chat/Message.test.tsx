import { render, screen } from '@testing-library/react';
import { Message } from './Message';

describe('Message', () => {
  it('рендер user сообщения', () => {
    render(
      <Message
        role="user"
        content="Привет"
        timestamp="12:00"
      />
    );

    expect(screen.getByText('Привет')).toBeInTheDocument();
    expect(screen.getByText('Пользователь')).toBeInTheDocument();
  });

  it('рендер assistant сообщения с кнопкой копирования', () => {
    render(
      <Message
        role="assistant"
        content="Ответ"
        timestamp="12:00"
      />
    );

    expect(screen.getByText('GigaChat')).toBeInTheDocument();
    expect(screen.getByText('Копировать')).toBeInTheDocument();
  });
});