export type ApiRole = 'system' | 'user' | 'assistant';

export interface ApiMessage {
  role: ApiRole;
  content: string;
}

export interface ChatCompletionOptions {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  repetitionPenalty: number;
}

export interface ApiModel {
  id: string;
  object: string;
  owned_by: string;
  type: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      role: string;
      content: string;
    };
  }>;
}

interface ModelsResponse {
  object: string;
  data: ApiModel[];
}

type StreamHandlers = {
  onChunk: (content: string) => void;
  signal?: AbortSignal;
};

export async function sendChatCompletion(
  messages: ApiMessage[],
  options: ChatCompletionOptions,
): Promise<string> {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: options.model,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
      repetition_penalty: options.repetitionPenalty,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }

  const data: ChatCompletionResponse = await response.json();

  return data.choices?.[0]?.message?.content ?? 'Пустой ответ от модели';
}

export async function streamChatCompletion(
  messages: ApiMessage[],
  options: ChatCompletionOptions,
  handlers: StreamHandlers,
): Promise<void> {
  const response = await fetch('http://localhost:3001/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      model: options.model,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
      repetition_penalty: options.repetitionPenalty,
    }),
    signal: handlers.signal,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Stream API error: ${response.status} ${errorText}`);
  }

  if (!response.body) {
    throw new Error('Stream body is empty');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';

    for (const event of events) {
      const lines = event
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;

        const raw = line.slice(5).trim();

        if (!raw || raw === '[DONE]') {
          continue;
        }

        try {
          const parsed = JSON.parse(raw);

          const delta =
            parsed.choices?.[0]?.delta?.content ??
            parsed.choices?.[0]?.message?.content ??
            '';

          if (delta) {
            handlers.onChunk(delta);
          }
        } catch {
          // пропускаем служебные строки
        }
      }
    }
  }
}

export async function fetchAvailableModels(): Promise<string[]> {
  const response = await fetch('http://localhost:3001/api/models');

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Models API error: ${response.status} ${errorText}`);
  }

  const data: ModelsResponse = await response.json();

  return (data.data ?? [])
    .filter((model) => model.type === 'chat')
    .map((model) => model.id);
}