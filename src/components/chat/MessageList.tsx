import { Message } from './Message';

type MessageItem = {
    id: string;
    author: string;
    text: string;
    variant: 'user' | 'assistant';
};

type MessageListProps = {
    messages: MessageItem[];
};

export function MessageList({ messages }: MessageListProps) {
    return (
        <div className="message-list">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    author={message.author}
                    text={message.text}
                    variant={message.variant}
                />
            ))}
        </div>
    );
}