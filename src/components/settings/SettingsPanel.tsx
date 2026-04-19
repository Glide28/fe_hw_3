import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';

type SettingsPanelProps = {
  isOpen: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
  onThemeChange: (theme: 'light' | 'dark') => void;

  availableModels: string[];
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  repetitionPenalty: number;

  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onTopPChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onSystemPromptChange: (value: string) => void;
  onRepetitionPenaltyChange: (value: number) => void;
  onReset: () => void;
};

export function SettingsPanel({
  isOpen,
  theme,
  onClose,
  onThemeChange,
  availableModels,
  model,
  temperature,
  topP,
  maxTokens,
  systemPrompt,
  repetitionPenalty,
  onModelChange,
  onTemperatureChange,
  onTopPChange,
  onMaxTokensChange,
  onSystemPromptChange,
  onRepetitionPenaltyChange,
  onReset,
}: SettingsPanelProps) {
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
              onChange={(e) => onModelChange(e.target.value)}
              className="form-control"
            >
              {availableModels.map((modelOption) => (
                <option key={modelOption} value={modelOption}>
                  {modelOption}
                </option>
              ))}
            </select>
          </label>

          <Slider
            label="Temperature"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={onTemperatureChange}
          />

          <Slider
            label="Top-P"
            min={0}
            max={1}
            step={0.1}
            value={topP}
            onChange={onTopPChange}
          />

          <Slider
            label="Repetition penalty"
            min={0}
            max={2}
            step={0.1}
            value={repetitionPenalty}
            onChange={onRepetitionPenaltyChange}
          />

          <label className="form-field">
            <span>Max Tokens</span>
            <input
              type="number"
              className="form-control"
              value={maxTokens}
              onChange={(e) => onMaxTokensChange(Number(e.target.value))}
            />
          </label>

          <label className="form-field">
            <span>System Prompt</span>
            <textarea
              className="form-control form-control--textarea"
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
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
          <Button variant="secondary" onClick={onReset}>
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