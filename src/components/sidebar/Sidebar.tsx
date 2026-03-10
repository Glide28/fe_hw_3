import { Button } from '../ui/Button';
import { ChatList } from './ChatList';
import { SearchInput } from './SearchInput';

type ChatItem = {
    id: string;
    title: string;
    lastMessageDate: string;
};

type SidebarProps = {
    chats: ChatItem[];
    activeChatId: string;
    isOpen: boolean;
    onClose: () => void;
    onSelectChat: (chatId: string) => void;
};

export function Sidebar({
    chats,
    activeChatId,
    isOpen,
    onClose,
    onSelectChat,
}: SidebarProps) {
    return (
        <>
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            <div className="sidebar__header">
                <Button variant="primary" fullWidth>
                    <span className="button__icon">＋</span>
                    Новый чат
                </Button>
                <SearchInput placeholder="Поиск по чатам" />
            </div>

            <ChatList
                chats={chats}
                activeChatId={activeChatId}
                onSelectChat={onSelectChat}
            />
        </aside>

        {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
        </>
    );
}