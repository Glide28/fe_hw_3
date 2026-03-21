import { type KeyboardEvent, useRef, useState } from 'react';
import { Button } from '../ui/Button';

type InputAreaProps = {
    onSend: (text: string) => void;
    isLoading: boolean;
};

export function InputArea({ onSend, isLoading }: InputAreaProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const resizeTextarea = () => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = 'auto';
        const lineHeight = 24;
        const maxHeight = lineHeight * 5;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    };

    const handleChange = (nextValue: string) => {
        setValue(nextValue);
        requestAnimationFrame(resizeTextarea);
    };

    const handleSend = () => {
        const trimmedValue = value.trim();

        if (!trimmedValue || isLoading) return;

        onSend(trimmedValue);
        setValue('');
        requestAnimationFrame(resizeTextarea);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="input-area">
            <button
                type="button"
                className="icon-button"
                aria-label="Прикрепить изображение"
                disabled={isLoading}
            >
                📎
            </button>

            <textarea
                ref={textareaRef}
                className="input-area__textarea"
                placeholder="Введите сообщение..."
                rows={1}
                value={value}
                disabled={isLoading}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <Button variant="secondary" disabled>
                Стоп
            </Button>

            <Button
                variant="primary"
                disabled={!value.trim() || isLoading}
                onClick={handleSend}
            >
                {isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
        </div>
    );
}