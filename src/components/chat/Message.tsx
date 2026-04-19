import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/github.css';
import type { MessageRole } from '../../types/message';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);

type MessageProps = {
  role: MessageRole;
  content: string;
  timestamp: string;
};

const MarkdownCodeBlock = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children ?? '').replace(/\n$/, '');

  if (!match) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const language = match[1];

  if (!hljs.getLanguage(language)) {
    return (
      <pre>
        <code className={className} {...props}>
          {code}
        </code>
      </pre>
    );
  }

  const highlighted = hljs.highlight(code, { language }).value;

  return (
    <pre>
      <code
        className={className}
        dangerouslySetInnerHTML={{ __html: highlighted }}
        {...props}
      />
    </pre>
  );
};

const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isInline = !className;

    if (isInline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <MarkdownCodeBlock className={className} {...props}>
        {children}
      </MarkdownCodeBlock>
    );
  },
};

export function Message({ role, content, timestamp }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const variant = role === 'user' ? 'user' : 'assistant';
  const author = role === 'user' ? 'Пользователь' : 'GigaChat';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className={`message message--${variant}`}>
      <div className="message__avatar">
        {variant === 'assistant' ? 'G' : 'U'}
      </div>

      <div className="message__bubble">
        <div className="message__meta">
          <span className="message__author">{author}</span>
          <span className="message__time">{timestamp}</span>

          {role === 'assistant' && (
            <button
              type="button"
              className="message__copy"
              onClick={handleCopy}
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </button>
          )}
        </div>

        <div className="message__text">
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}