import { useState } from "react";
import "./styles/theme.css";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthForm } from "./components/auth/AuthForm";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return <AuthForm onLogin={() => setIsAuthenticated(true)} />;
    }

    return <AppLayout />;
}

export default App;