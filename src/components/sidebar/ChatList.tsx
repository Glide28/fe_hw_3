import ChatItem from './ChatItem';

type Chat = {
  id: string;
  title: string;
  lastMessageDate: string;
};

type ChatListProps = {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
};

export function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: ChatListProps) {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chatId={chat.id}
          title={chat.title}
          date={chat.lastMessageDate}
          isActive={chat.id === activeChatId}
          onClick={() => onSelectChat(chat.id)}
          onRename={() => onRenameChat(chat.id)}
          onDelete={() => onDeleteChat(chat.id)}
        />
      ))}
    </div>
  );
}