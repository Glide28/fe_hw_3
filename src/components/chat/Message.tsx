import ReactMarkdown from 'react-markdown';
import type { MessageRole } from '../../types/message';

type MessageProps = {
    role: MessageRole;
    content: string;
    timestamp: string;
};

export function Message({ role, content, timestamp }: MessageProps) {
    const variant = role === 'user' ? 'user' : 'assistant';
    const author = role === 'user' ? 'Пользователь' : 'GigaChat';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
        } catch {
            // заглушка без дополнительной обработки
        }
    };

    return (
        <article className={`message message--${variant}`}>
            <div className="message__avatar">
                {variant === 'assistant' ? 'G' : 'U'}
            </div>

            <div className="message__bubble">
                <div className="message__meta">
                    <span className="message__author">{author}</span>
                    <span className="message__time">{timestamp}</span>
                    <button
                        type="button"
                        className="message__copy"
                        onClick={handleCopy}
                    >
                        Копировать
                    </button>
                </div>

                <div className="message__text">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}