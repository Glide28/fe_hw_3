import { useState } from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { ChatWindow } from '../chat/ChatWindow';
import { SettingsPanel } from '../settings/SettingsPanel';
import { EmptyState } from '../chat/EmptyState';
import { useChat } from '../../app/providers/ChatProvider';

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

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main-content">
        {activeChat ? (
          <ChatWindow
            chatTitle={activeChat.title}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        ) : (
          <EmptyState />
        )}
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        theme={theme}
        onClose={() => setIsSettingsOpen(false)}
        onThemeChange={setTheme}
      />
    </div>
  );
}