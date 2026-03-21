import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { MessageRole } from '../../types/message';

type MessageProps = {
    role: MessageRole;
    content: string;
    timestamp: string;
};

export function Message({ role, content, timestamp }: MessageProps) {
    const [copied, setCopied] = useState(false);

    const variant = role === 'user' ? 'user' : 'assistant';
    const author = role === 'user' ? 'Пользователь' : 'GigaChat';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            setCopied(false);
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

                    {role === 'assistant' && (
                        <button
                            type="button"
                            className="message__copy"
                            onClick={handleCopy}
                        >
                            {copied ? 'Скопировано' : 'Копировать'}
                        </button>
                    )}
                </div>

                <div className="message__text">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}