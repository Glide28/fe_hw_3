import { ChatItem } from './ChatItem';

type Chat = {
    id: string;
    title: string;
    lastMessageDate: string;
};

type ChatListProps = {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (chatId: string) => void;
};

export function ChatList({
    chats,
    activeChatId,
    onSelectChat,
}: ChatListProps) {
    return (
        <div className="chat-list">
        {chats.map((chat) => (
            <ChatItem
                key={chat.id}
                title={chat.title}
                date={chat.lastMessageDate}
                isActive={chat.id === activeChatId}
                onClick={() => onSelectChat(chat.id)}
            />
        ))}
        </div>
    );
}