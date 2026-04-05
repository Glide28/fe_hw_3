import { useEffect, useState } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { AppRouter } from './app/router/AppRouter';

const AUTH_STORAGE_KEY = 'chat_app_is_authenticated';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthForm onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AppRouter />;
}

export default App;