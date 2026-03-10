import { useState } from 'react';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';

type AuthFormProps = {
    onLogin: () => void;
};

export function AuthForm({ onLogin }: AuthFormProps) {
    const [credentials, setCredentials] = useState('');
    const [scope, setScope] = useState('GIGACHAT_API_PERS');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!credentials.trim()) {
            setError('Поле Credentials не должно быть пустым.');
            return;
        }

        setError('');
        void scope;
        onLogin();
    };

    return (
        <div className="auth-page" data-theme="light">
            <div className="auth-card">
                <h1 className="auth-card__title">Вход в приложение</h1>

                <label className="form-field">
                    <span>Credentials (Base64)</span>
                    <input
                        type="password"
                        className="form-control"
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        placeholder="Введите Base64-строку"
                    />
                </label>

                <div className="form-field">
                    <span>Scope</span>

                    <label className="radio-row">
                        <input
                            type="radio"
                            name="scope"
                            value="GIGACHAT_API_PERS"
                            checked={scope === 'GIGACHAT_API_PERS'}
                            onChange={(e) => setScope(e.target.value)}
                        />
                        GIGACHAT_API_PERS
                    </label>

                    <label className="radio-row">
                        <input
                            type="radio"
                            name="scope"
                            value="GIGACHAT_API_B2B"
                            checked={scope === 'GIGACHAT_API_B2B'}
                            onChange={(e) => setScope(e.target.value)}
                        />
                        GIGACHAT_API_B2B
                    </label>

                    <label className="radio-row">
                        <input
                            type="radio"
                            name="scope"
                            value="GIGACHAT_API_CORP"
                            checked={scope === 'GIGACHAT_API_CORP'}
                            onChange={(e) => setScope(e.target.value)}
                        />
                        GIGACHAT_API_CORP
                    </label>
                </div>

                {error && <ErrorMessage message={error} />}

                <Button variant="primary" fullWidth onClick={handleSubmit}>Войти</Button>
            </div>
        </div>
    );
}