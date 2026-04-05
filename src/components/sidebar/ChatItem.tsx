type ChatItemProps = {
  chatId: string;
  title: string;
  date: string;
  isActive?: boolean;
  onClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
};

export function ChatItem({
  chatId,
  title,
  date,
  isActive = false,
  onClick,
  onRename,
  onDelete,
}: ChatItemProps) {
  return (
    <button
      type="button"
      className={`chat-item ${isActive ? 'chat-item--active' : ''}`}
      onClick={onClick}
      data-chat-id={chatId}
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
          onClick={(e) => {
            e.stopPropagation();
            onRename?.();
          }}
        >
          ✎
        </button>

        <button
          type="button"
          className="icon-button icon-button--danger"
          aria-label="Удалить чат"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          🗑
        </button>
      </div>
    </button>
  );
}