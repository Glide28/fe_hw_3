type ToggleProps = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export function Toggle({ checked, onChange }: ToggleProps) {
    return (
        <button
            type="button"
            className={`toggle ${checked ? 'toggle--checked' : ''}`}
            onClick={() => onChange(!checked)}
            aria-label="Переключить тему"
        >
            <span className="toggle__thumb" />
        </button>
    );
}