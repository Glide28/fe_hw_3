type TypingIndicatorProps = {
    isVisible?: boolean;
};

export function TypingIndicator({
    isVisible = true,
}: TypingIndicatorProps) {
    if (!isVisible) return null;

    return (
        <div className="typing-indicator" aria-label="Ассистент печатает">
            <span className="typing-indicator__dot" />
            <span className="typing-indicator__dot" />
            <span className="typing-indicator__dot" />
        </div>
    );
}