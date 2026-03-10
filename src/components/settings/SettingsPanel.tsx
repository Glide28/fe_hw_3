import { useState } from 'react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';

type SettingsPanelProps = {
    isOpen: boolean;
    theme: 'light' | 'dark';
    onClose: () => void;
    onThemeChange: (theme: 'light' | 'dark') => void;
};

export function SettingsPanel({
    isOpen,
    theme,
    onClose,
    onThemeChange,
}: SettingsPanelProps) {
    const [model, setModel] = useState('GigaChat');
    const [temperature, setTemperature] = useState(1);
    const [topP, setTopP] = useState(0.8);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [systemPrompt, setSystemPrompt] = useState(
        'Ты полезный AI-ассистент.'
    );

    const handleReset = () => {
        setModel('GigaChat');
        setTemperature(1);
        setTopP(0.8);
        setMaxTokens(2048);
        setSystemPrompt('Ты полезный AI-ассистент.');
        onThemeChange('light');
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="settings-backdrop" onClick={onClose} />
        <aside className="settings-panel" role="dialog" aria-modal="true">
            <div className="settings-panel__header">
                <h2>Настройки</h2>
                <button
                    type="button"
                    className="icon-button"
                    onClick={onClose}
                    aria-label="Закрыть настройки"
                >
                    ✕
                </button>
            </div>

            <div className="settings-panel__body">
                <label className="form-field">
                    <span>Модель</span>
                    <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="form-control"
                    >
                    <option>GigaChat</option>
                    <option>GigaChat-Plus</option>
                    <option>GigaChat-Pro</option>
                    <option>GigaChat-Max</option>
                    </select>
                </label>

                <Slider
                    label="Temperature"
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={setTemperature}
                />

                <Slider
                    label="Top-P"
                    min={0}
                    max={1}
                    step={0.1}
                    value={topP}
                    onChange={setTopP}
                />

                <label className="form-field">
                    <span>Max Tokens</span>
                    <input
                    type="number"
                    className="form-control"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    />
                </label>

                <label className="form-field">
                    <span>System Prompt</span>
                    <textarea
                    className="form-control form-control--textarea"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                </label>

                <div className="form-field">
                    <span>Тёмная тема</span>
                    <Toggle
                    checked={theme === 'dark'}
                    onChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
                    />
                </div>
            </div>

            <div className="settings-panel__footer">
                <Button variant="secondary" onClick={handleReset}>
                    Сбросить
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Сохранить
                </Button>
            </div>
        </aside>
        </>
    );
}