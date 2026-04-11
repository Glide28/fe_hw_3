import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  it('отправляет сообщение по кнопке', async () => {
    const onSend = vi.fn();

    render(<InputArea onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    const button = screen.getByText('Отправить');

    await userEvent.type(textarea, 'Привет');
    await userEvent.click(button);

    expect(onSend).toHaveBeenCalledWith('Привет');
  });

  it('отправляет по Enter', async () => {
    const onSend = vi.fn();

    render(<InputArea onSend={onSend} isLoading={false} />);

    const textarea = screen.getByPlaceholderText('Введите сообщение...');

    await userEvent.type(textarea, 'Привет{enter}');

    expect(onSend).toHaveBeenCalled();
  });

  it('не отправляет пустое сообщение', async () => {
    const onSend = vi.fn();

    render(<InputArea onSend={onSend} isLoading={false} />);

    const button = screen.getByText('Отправить');

    await userEvent.click(button);

    expect(onSend).not.toHaveBeenCalled();
  });
});