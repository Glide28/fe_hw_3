export type ApiRole = 'system' | 'user' | 'assistant';

export interface ApiMessage {
  role: ApiRole;
  content: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      role: string;
      content: string;
    };
  }>;
}

export async function sendChatCompletion(
  messages: ApiMessage[]
): Promise<string> {
  const response = await fetch('http://localhost:3001/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} ${errorText}`);
  }

  const data: ChatCompletionResponse = await response.json();

  return data.choices?.[0]?.message?.content ?? 'Пустой ответ от модели';
}