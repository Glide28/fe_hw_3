import { Message as MessageComponent } from './Message';
import type { Message } from '../../types/message';

type MessageListProps = {
    messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
    return (
        <>
            {messages.map((message) => (
                <MessageComponent
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                />
            ))}
        </>
    );
}