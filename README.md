# FE HW 9 — Chat Application with GigaChat API
# ДЗ 9

SPA-приложение чата, реализованное на **React + TypeScript + Vite** с интеграцией **GigaChat API (через backend proxy)**.

В рамках задания выполнены:
- оптимизация бандла
- code splitting (React.lazy + Suspense)
- оптимизация ререндеров
- обработка ошибок через ErrorBoundary
- деплой frontend на Vercel

---

## Демо

**Production:**  
[https://fe-hw-3-cqf8.vercel.app](https://fe-hw-3-cqf8.vercel.app)

**Проверка роутинга:**  
[https://fe-hw-3-cqf8.vercel.app/chat/1](https://fe-hw-3-cqf8.vercel.app/chat/1)

###  Особенность
Backend (Express + GigaChat API) не задеплоен, поэтому:
-  UI работает полностью
-  роутинг работает
-  запросы к API в проде возвращают ошибку (это ожидаемо)

**Скриншоты:**  
См. папку `docs/`
- `bundle-analysis.png` — анализ бандла

---

## 🛠 Стек

### Frontend
- React 19
- TypeScript 5
- Vite 7
- react-router-dom 7
- react-markdown 10

### State management
- Context API
- useReducer

### Performance
- React.lazy
- Suspense
- React.memo
- useMemo
- useCallback
- rollup-plugin-visualizer

### Testing
- Vitest
- @testing-library/react
- @testing-library/user-event
- jsdom

### Backend (локально)
- Node.js
- Express
- dotenv
- CORS

---

## Запуск локально

### 1. Клонирование репозитория
```bash
git clone https://github.com/Glide28/fe_hw_3.git
cd fe_hw_3
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
```bash
cp .env.example .env
```

### 4. Запуск backend
```bash
cd server
npm install
npm run dev
```

### 5. Запуск frontend
```bash
cd ..
npm run dev
```

Приложение будет доступно по адресу:  
**http://localhost:5173**

---

## Переменные окружения

### Frontend (`.env`)
| Переменная | Описание |
|------------|----------|
| `VITE_API_URL` | URL backend API |

### Backend (`server/.env`)
| Переменная | Описание |
|------------|----------|
| `GIGACHAT_AUTH_KEY` | Base64 ключ для авторизации |
| `GIGACHAT_SCOPE` | Область доступа API |

---

## Структура проекта

```
src/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── chat/
│   ├── sidebar/
│   └── layout/
├── app/
│   ├── providers/
│   └── router/
├── docs/
│   └── bundle-analysis.png
├── .env.example
└── vercel.json
```

---

## Оптимизация производительности

### 1. Code splitting

Используется:
```typescript
const Sidebar = lazy(() => import(...))
const SettingsPanel = lazy(() => import(...))
const ChatWindow = lazy(() => import(...))
```

**Результат:**
- уменьшен initial bundle
- загрузка компонентов по требованию

### 2. Bundle analysis

**Использован:**  
`rollup-plugin-visualizer`

**Получен файл:**  
`stats.html`

### 3. Оптимизация ререндеров

**Использовано:**
- `React.memo` → `ChatItem`
- `useMemo` → фильтрация чатов
- `useCallback` → обработчики `Sidebar`

---

## Обработка ошибок

### ErrorBoundary

Реализован классовый компонент с:
- `componentDidCatch()`

Оборачивает:
- `<MessageList />`

### Ошибки API
- ошибки НЕ добавляются как сообщения
- отображаются в UI под input
- добавлена кнопка «Повторить»

---

## Деплой

Frontend задеплоен на **Vercel**

Используется `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

Это позволяет:
- корректно открывать `/chat/:id`
- избежать 404 при прямом переходе

---

## Итого

В рамках задания реализовано:
- оптимизация бандла
- code splitting
- устранение лишних ререндеров
- обработка ошибок через ErrorBoundary
- UI-обработка API ошибок
- деплой SPA на Vercel
- корректная работа client-side routing
---