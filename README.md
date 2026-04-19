# Chat Application with GigaChat API
# Арсений Паниклов
# группа BHEMBD-25

SPA-приложение чата на **React + TypeScript + Vite** с интеграцией **GigaChat API** через backend proxy.

Реализован полноценный AI-чат с функциональностью, повторяющей ключевые принципы современных LLM-интерфейсов (ChatGPT-like UX): потоковая генерация ответа, остановка генерации, управление параметрами модели, динамический выбор моделей, поддержка контекста диалога.

---

## Содержание

- [Демо](#демо)
- [Функциональность](#функциональность)
- [Стек технологий](#стек-технологий)
- [Архитектура](#архитектура)
- [Структура проекта](#структура-проекта)
- [Установка и запуск](#установка-и-запуск)
- [Переменные окружения](#переменные-окружения)
- [Примеры работы](#примеры-работы)
- [Запуск тестов](#запуск-тестов)
- [Деплой](#деплой)
- [Оптимизация производительности](#оптимизация-производительности)
- [Обработка ошибок](#обработка-ошибок)
- [Безопасность](#безопасность)

---

## Демо

**Production (frontend):**  
https://fe-hw-3-cqf8.vercel.app

**Проверка роутинга:**  
https://fe-hw-3-cqf8.vercel.app/chat/1

> **Важно:** backend (Express + GigaChat API) не задеплоен, поэтому в production-версии:
> - UI работает полностью
> - роутинг работает
> - запросы к API возвращают ошибку (ожидаемое поведение при отсутствии backend)

Для полноценной работы приложения необходимо запустить backend локально — см. раздел [Установка и запуск](#установка-и-запуск).

---

## Функциональность

### Работа с чатами
- создание нескольких диалогов
- переключение между чатами
- автогенерация названия чата по первому сообщению
- ручное переименование чата
- удаление чата с подтверждением
- поиск по названию и содержимому
- сохранение истории в `localStorage` (переживает перезагрузку)
- открытие конкретного чата по URL: `/chat/:id`

### Интеграция с GigaChat API
- взаимодействие через backend-прокси (Express)
- получение OAuth-токена на backend
- передача полного контекста диалога:
  ```json
  {
    messages: [
      { "role": "system", "content": "..." },
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ]
  }
  ```
- динамический список моделей (endpoint `GET /api/models`)

### Потоковая генерация (Streaming / SSE)
- параметр `"stream": true`
- backend проксирует `text/event-stream`
- frontend читает поток через `ReadableStream` (SSE)
- текст отображается постепенно (как в ChatGPT)
- уменьшенное время ожидания первого токена

### Остановка генерации
- реализовано через `AbortController`
- кнопка **«Стоп»** в режиме загрузки
- корректное закрытие соединения на backend

### Настройки генерации
Пользователь управляет параметрами модели через UI:

| Параметр | Описание |
|---|---|
| `model` | выбор модели из доступных |
| `temperature` | креативность ответа |
| `top_p` | стратегия сэмплинга |
| `max_tokens` | максимальная длина ответа |
| `repetition_penalty` | штраф за повторы |
| `system_prompt` | задание поведения модели |

### Markdown + подсветка кода
- рендеринг Markdown через `react-markdown`
- подсветка синтаксиса через `highlight.js/core`
- подключены только нужные языки → уменьшенный bundle

### UX
- отправка сообщения по `Enter`
- новая строка по `Shift + Enter`
- автопрокрутка вниз при новом сообщении
- копирование ответа ассистента одной кнопкой
- отображение ошибки API под полем ввода
- кнопка **«Повторить»** для повторной отправки

---

## Стек технологий

### Frontend
- **React 19** — UI-библиотека
- **TypeScript 5** — типизация
- **Vite 7** — сборщик
- **react-router-dom 7** — маршрутизация
- **react-markdown 10** — рендеринг Markdown
- **highlight.js** — подсветка кода

### State management
- **Context API** + **useReducer** — глобальный стор

### Performance
- `React.lazy` + `Suspense` — code splitting
- `React.memo`, `useMemo`, `useCallback` — оптимизация ререндеров
- `rollup-plugin-visualizer` — анализ бандла

### Testing
- **Vitest** — test runner
- **@testing-library/react** — тестирование компонентов
- **@testing-library/user-event** — имитация действий пользователя
- **@testing-library/jest-dom** — расширенные matchers
- **jsdom** — тестовое окружение

### Backend
- **Node.js** + **Express** — сервер
- **CORS** — работа с cross-origin запросами
- **dotenv** — управление секретами

### AI API
- **GigaChat API** (через backend proxy)

---

## Архитектура

Приложение построено по принципу:

```
UI → Context (useReducer) → API layer → Backend Proxy → GigaChat API
```

Проект разделён на две части:

### Frontend (корень проекта)
- интерфейс и маршрутизация
- управление состоянием чатов
- отображение сообщений
- обработка UI-ошибок
- lazy-loading тяжёлых компонентов

### Backend (`server/`)
- получение OAuth-токена GigaChat
- проксирование запросов к GigaChat API
- стриминг ответов (SSE)
- **изоляция секретного ключа** от клиента

> Backend необходим, потому что API-ключ GigaChat **нельзя** хранить на клиенте.

---

## Структура проекта

```
fe_hw_3/
├── docs/
│   └── bundle-analysis.png          # анализ бандла
│
├── server/                          # backend-прокси
│   ├── .env.example
│   ├── index.js                     # основной файл backend
│   ├── package.json
│   └── package-lock.json
│
├── src/
│   ├── api/
│   │   └── gigachat.ts              # клиент для запросов к backend
│   │
│   ├── app/
│   │   ├── providers/
│   │   │   ├── ChatProvider.tsx     # глобальный стор
│   │   │   ├── chatReducer.test.ts
│   │   │   └── ChatProvider.storage.test.tsx
│   │   └── router/
│   │       └── AppRouter.tsx        # маршрутизация
│   │
│   ├── components/
│   │   ├── auth/                    # форма входа
│   │   ├── chat/                    # окно чата, сообщения, input
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── InputArea.tsx
│   │   │   ├── InputArea.test.tsx
│   │   │   └── Message.test.tsx
│   │   ├── layout/
│   │   │   └── AppLayout.tsx
│   │   ├── settings/                # панель настроек модели
│   │   ├── sidebar/                 # список чатов
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ChatList.tsx
│   │   │   ├── ChatItem.tsx
│   │   │   └── Sidebar.test.tsx
│   │   ├── ui/                      # переиспользуемые UI-элементы
│   │   └── ErrorBoundary.tsx        # границы ошибок
│   │
│   ├── styles/
│   ├── setupTests.ts                # настройка тестов
│   ├── App.tsx                      # корневой компонент
│   └── main.tsx                     # точка входа
│
├── .gitignore
├── package.json
├── vite.config.ts
├── vercel.json                      # конфиг деплоя
└── README.md
```

---

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone https://github.com/Glide28/fe_hw_3.git
cd fe_hw_3
```

### 2. Установка frontend-зависимостей

```bash
npm install
```

### 3. Установка backend-зависимостей

```bash
cd server
npm install
cd ..
```

### 4. Настройка переменных окружения

В папке `server/` создайте файл `.env` на основе шаблона `server/.env.example`:

```env
GIGACHAT_AUTH_KEY=your_gigachat_auth_key_here
GIGACHAT_SCOPE=GIGACHAT_API_PERS
```

При необходимости в корне создайте `.env` для frontend:

```env
VITE_API_URL=http://localhost:3001
```

### 5. Запуск backend

Из папки `server/`:

```bash
npm run dev
```

Backend запустится на **http://localhost:3001**

### 6. Запуск frontend

Из корня проекта (в отдельном терминале):

```bash
npm run dev
```

Frontend запустится на **http://localhost:5173**

### 7. Production build

```bash
npm run build
npm run preview
```

---

## Переменные окружения

### Backend (`server/.env`)

| Переменная | Описание | Обязательная |
|---|---|---|
| `GIGACHAT_AUTH_KEY` | Base64 ключ авторизации GigaChat | ✅ |
| `GIGACHAT_SCOPE` | Область доступа API (`GIGACHAT_API_PERS`) | ✅ |

### Frontend (`.env`)

| Переменная | Описание | Обязательная |
|---|---|---|
| `VITE_API_URL` | URL backend proxy | опционально |

---

## Примеры работы

### Пример 1. Создание чата и отправка сообщения

1. Откройте `http://localhost:5173`
2. Пройдите форму входа (учебная заглушка)
3. Нажмите **«Новый чат»** в сайдбаре
4. Введите сообщение: `Помоги решить задачу по TypeScript`
5. Нажмите `Enter` или кнопку отправки
6. Название чата автоматически сформируется из первого сообщения
7. Ответ модели придёт в потоковом режиме (streaming)

### Пример 2. Настройка параметров модели

1. Откройте панель настроек (иконка в сайдбаре)
2. Выберите модель из списка (загружается динамически с backend)
3. Настройте параметры:
   - `temperature: 0.7` — баланс креативности
   - `max_tokens: 1000` — длина ответа
   - `system_prompt: "Отвечай кратко и по делу"` — поведение
4. Отправьте сообщение — настройки применятся

### Пример 3. Остановка генерации

1. Начните длинный запрос (например, «Напиши длинную статью про React»)
2. Во время стриминга появится кнопка **«Стоп»**
3. Нажмите — генерация остановится, текст останется

### Пример 4. Восстановление по URL

1. Создайте чат
2. Скопируйте URL из адресной строки (например, `/chat/abc-123`)
3. Обновите страницу или откройте URL в новой вкладке
4. Приложение восстановит нужный чат

### Пример 5. Обработка ошибки API

1. Остановите backend (или отправьте запрос с production-версии)
2. Попробуйте отправить сообщение
3. Под полем ввода появится ошибка
4. Нажмите кнопку **«Повторить»** — запрос отправится снова

---

## Формат состояния

```ts
type ChatState = {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
};
```

---

## Запуск тестов

```bash
# Однократный прогон
npm test

# Watch-режим
npx vitest

# С отчётом о покрытии
npx vitest --coverage
```

### Покрытие тестами

- **Юнит-тесты** `chatReducer` — 6 тестов (CREATE_CHAT, ADD_MESSAGE, RENAME_CHAT, DELETE_CHAT, SET_LOADING)
- **Интеграционные тесты** `ChatProvider + localStorage` — 3 теста
- **Тесты компонентов**:
  - `InputArea` — 3 теста
  - `Message` — 2 теста
  - `Sidebar` — 3 теста

Тесты работают через **Vitest** в окружении **jsdom**, с расширенными matchers из `@testing-library/jest-dom`.

---

## Деплой

Frontend задеплоен на **Vercel**.

### Конфигурация `vercel.json`

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

Это обеспечивает:
- корректное открытие `/chat/:id` при прямом переходе
- отсутствие 404 на вложенных маршрутах

### Важно при деплое

- API-ключи хранятся **только** в environment variables хостинга
- секреты **никогда** не попадают в frontend-код
- `.env` файлы добавлены в `.gitignore`

---

## Оптимизация производительности

### 1. Code Splitting через `React.lazy + Suspense`

В отдельные чанки вынесены:

```typescript
const Sidebar = lazy(() => import('./components/sidebar/Sidebar'));
const SettingsPanel = lazy(() => import('./components/settings/SettingsPanel'));
const ChatWindow = lazy(() => import('./components/chat/ChatWindow'));
```

**Результат:**
- уменьшенный initial bundle
- загрузка компонентов по требованию
- быстрый первый рендер

### 2. Bundle Analysis

Подключён `rollup-plugin-visualizer` — при сборке генерируется `stats.html` с визуализацией размеров чанков. Скриншот анализа: `docs/bundle-analysis.png`.

### 3. Оптимизация ререндеров

- `React.memo` для `ChatItem`
- `useMemo` для вычисления списка `chatItems`
- `useCallback` для обработчиков в `Sidebar`

### 4. Tree Shaking

- импорт `highlight.js/core` вместо полного пакета
- регистрация только нужных языков
- удаление неиспользуемого кода при сборке

---

## Обработка ошибок

### ErrorBoundary (класс-компонент)

```
<ErrorBoundary>
  <MessageList />
</ErrorBoundary>
```

Локально перехватывает ошибки рендера → предотвращает падение всего приложения.

### Ошибки API

- ошибки **не** добавляются в историю как сообщения
- отображаются в UI под полем ввода
- доступна кнопка **«Повторить»** для повторной отправки
- fallback при сбое streaming

### Ошибки роутера

- несуществующий `chat/:id` → редирект на `/`
- битый JSON в `localStorage` → создаётся новый пустой чат

---

## Безопасность

### Никогда не коммитить:

- `server/.env`
- реальные API-ключи и токены
- production-секреты

### В репозитории хранится только:

- `server/.env.example` — шаблон без секретов

### При деплое:

- API-ключи → только в env-переменных хостинга
- все запросы к GigaChat идут через **backend**
- frontend **не видит** секретов

---

## История разработки

Проект развивался поэтапно в рамках учебной программы:

| Этап | Содержание |
|---|---|
| **ДЗ 3** | Базовая архитектура: Context + useReducer, роутинг, localStorage, GigaChat API через backend proxy |
| **ДЗ 8** | Тестирование: Vitest, Testing Library, юнит- и интеграционные тесты |
| **ДЗ 9** | Оптимизация: code splitting, bundle analysis, React.memo/useMemo/useCallback, ErrorBoundary, деплой на Vercel |
| **Итог** | Streaming (SSE), остановка генерации, настройки модели, динамический список моделей, подсветка кода |

---

## Автор

GitHub: [@Glide28](https://github.com/Glide28)

---