import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { EmptyState } from '../chat/EmptyState';
import { useChat } from '../../app/providers/ChatProvider';
import { fetchAvailableModels } from '../../api/gigachat';

const Sidebar = lazy(() =>
  import('../sidebar/Sidebar').then((module) => ({
    default: module.Sidebar,
  }))
);

const SettingsPanel = lazy(() =>
  import('../settings/SettingsPanel').then((module) => ({
    default: module.SettingsPanel,
  }))
);

const ChatWindow = lazy(() =>
  import('../chat/ChatWindow').then((module) => ({
    default: module.ChatWindow,
  }))
);

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [availableModels, setAvailableModels] = useState<string[]>(['GigaChat']);
  const [model, setModel] = useState('GigaChat');
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(0.8);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный AI-ассистент.');
  const [repetitionPenalty, setRepetitionPenalty] = useState(1);

  const hasLoadedModelsRef = useRef(false);

  const { activeChat } = useChat();

  useEffect(() => {
    if (hasLoadedModelsRef.current) return;
    hasLoadedModelsRef.current = true;

    const loadModels = async () => {
      try {
        const models = await fetchAvailableModels();

        if (models.length > 0) {
          setAvailableModels(models);

          if (!models.includes(model)) {
            setModel(models[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load models:', error);
      }
    };

    void loadModels();
  }, []);

  const handleResetSettings = () => {
    setModel('GigaChat');
    setTemperature(1);
    setTopP(0.8);
    setMaxTokens(2048);
    setSystemPrompt('Ты полезный AI-ассистент.');
    setRepetitionPenalty(1);
    setTheme('light');
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <button
        className="burger-button"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Открыть боковую панель"
      >
        ☰
      </button>

      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Suspense>

      <main className="main-content">
        {activeChat ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ChatWindow
              chatTitle={activeChat.title}
              onOpenSettings={() => setIsSettingsOpen(true)}
              model={model}
              temperature={temperature}
              topP={topP}
              maxTokens={maxTokens}
              systemPrompt={systemPrompt}
              repetitionPenalty={repetitionPenalty}
            />
          </Suspense>
        ) : (
          <EmptyState />
        )}
      </main>

      <Suspense fallback={<div>Loading...</div>}>
        <SettingsPanel
          isOpen={isSettingsOpen}
          theme={theme}
          onClose={() => setIsSettingsOpen(false)}
          onThemeChange={setTheme}
          availableModels={availableModels}
          model={model}
          temperature={temperature}
          topP={topP}
          maxTokens={maxTokens}
          systemPrompt={systemPrompt}
          repetitionPenalty={repetitionPenalty}
          onModelChange={setModel}
          onTemperatureChange={setTemperature}
          onTopPChange={setTopP}
          onMaxTokensChange={setMaxTokens}
          onSystemPromptChange={setSystemPrompt}
          onRepetitionPenaltyChange={setRepetitionPenalty}
          onReset={handleResetSettings}
        />
      </Suspense>
    </div>
  );
}