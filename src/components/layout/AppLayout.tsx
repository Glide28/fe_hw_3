import { useState, lazy, Suspense } from 'react';
import { EmptyState } from '../chat/EmptyState';
import { useChat } from '../../app/providers/ChatProvider';

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

  const { activeChat } = useChat();

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
        />
      </Suspense>
    </div>
  );
}