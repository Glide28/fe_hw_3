type ChatItemProps = {
    title: string;
    date: string;
    isActive?: boolean;
    onClick?: () => void;
};

export function ChatItem({
    title,
    date,
    isActive = false,
    onClick,
}: ChatItemProps) {
    return (
        <button
            type="button"
            className={`chat-item ${isActive ? 'chat-item--active' : ''}`}
            onClick={onClick}
        >
            <div className="chat-item__content">
                <div className="chat-item__title" title={title}>
                    {title}
                </div>
                <div className="chat-item__date">{date}</div>
            </div>

            <div className="chat-item__actions">
                <button
                    type="button"
                    className="icon-button"
                    aria-label="Редактировать чат"
                    onClick={(e) => e.stopPropagation()}
                >
                    ✎
                </button>
                <button
                    type="button"
                    className="icon-button icon-button--danger"
                    aria-label="Удалить чат"
                    onClick={(e) => e.stopPropagation()}
                >
                    🗑
                </button>
            </div>
        </button>
    );
}