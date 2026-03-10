import ReactMarkdown from 'react-markdown';

type MessageProps = {
    author: string;
    text: string;
    variant: 'user' | 'assistant';
};

export function Message({ author, text, variant }: MessageProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // заглушка без обработки
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
                <button
                    type="button"
                    className="message__copy"
                    onClick={handleCopy}
                >
                    Копировать
                </button>
            </div>

            <div className="message__text">
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        </div>
        </article>
    );
}