'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MoreVertical, 
  Bot, 
  User,
  Loader2,
  Image as ImageIcon,
  FileText,
  X,
  Minimize2,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { Button, Input, Avatar, FlexLayout, Container } from '@/components';
import { cn } from '@/utils';

interface Message {
  readonly id: string;
  readonly content: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly timestamp: Date;
  readonly attachments?: Attachment[];
  readonly status?: 'sending' | 'sent' | 'error';
}

interface Attachment {
  readonly id: string;
  readonly name: string;
  readonly type: 'image' | 'file';
  readonly size: number;
  readonly url?: string;
}

interface ChatbotLayoutProps {
  readonly messages: Message[];
  readonly onSendMessage: (content: string, attachments?: Attachment[]) => void;
  readonly isLoading?: boolean;
  readonly placeholder?: string;
  readonly welcomeMessage?: React.ReactNode;
  readonly suggestions?: string[];
  readonly onSuggestionClick?: (suggestion: string) => void;
  readonly className?: string;
}

interface ChatHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly onAction?: (action: string) => void;
  readonly isFullscreen?: boolean;
  readonly onToggleFullscreen?: () => void;
  readonly className?: string;
}

interface ChatMessageProps {
  readonly message: Message;
  readonly isLast?: boolean;
}

interface ChatInputProps {
  readonly onSend: (content: string, attachments?: Attachment[]) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly attachmentsEnabled?: boolean;
  readonly voiceEnabled?: boolean;
  readonly className?: string;
}

/**
 * Full-page chatbot layout component
 * @returns JSX.Element
 */
export const ChatbotLayout = ({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Type your message...',
  welcomeMessage,
  suggestions,
  onSuggestionClick,
  className,
}: ChatbotLayoutProps): JSX.Element => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <FlexLayout
      direction="column"
      className={cn(
        'bg-background',
        isFullscreen ? 'fixed inset-0 z-50' : 'h-full',
        className
      )}
    >
      {/* Header */}
      <ChatHeader
        title="AI Assistant"
        subtitle="Always here to help"
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onAction={(action) => console.log('Action:', action)}
      />

      {/* Messages Area */}
      <Container size="xl" className="flex-1 overflow-y-auto" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
        {messages.length === 0 && welcomeMessage ? (
          <Container size="md" centered>
            {welcomeMessage}
            {suggestions && suggestions.length > 0 && (
              <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <p className="text-lg text-muted-foreground" style={{ marginBottom: 'var(--spacing-lg)' }}>Try asking:</p>
                <FlexLayout direction="row" wrap gap="md">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="rounded-2xl text-lg" style={{ height: 'var(--button-lg)', paddingLeft: 'var(--spacing-lg)', paddingRight: 'var(--spacing-lg)' }}"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </FlexLayout>
              </div>
            )}
          </Container>
        ) : (
          <Container size="md" centered>
            <FlexLayout direction="column" gap="xl">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <FlexLayout direction="row" align="start" gap="md">
                <Avatar size="md" className="bg-primary/10">
                  <Bot className="text-primary" style={{ height: 'var(--icon-lg)', width: 'var(--icon-lg)' }} />
                </Avatar>
                <div className="bg-muted rounded-2xl" style={{ padding: 'var(--spacing-lg)' }}>
                  <FlexLayout direction="row" align="center" gap="md">
                    <Loader2 className="animate-spin" style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
                    <span className="text-lg text-muted-foreground">Thinking...</span>
                  </FlexLayout>
                </div>
              </FlexLayout>
            )}
              <div ref={messagesEndRef} />
            </FlexLayout>
          </Container>
        )}
      </Container>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container size="lg" style={{ paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)' }}>
          <ChatInput
            onSend={onSendMessage}
            placeholder={placeholder}
            disabled={isLoading}
            attachmentsEnabled
            voiceEnabled
          />
        </Container>
      </div>
    </FlexLayout>
  );
};

/**
 * Chat header component
 */
const ChatHeader = ({
  title = 'Chat',
  subtitle,
  onAction,
  isFullscreen,
  onToggleFullscreen,
  className,
}: ChatHeaderProps): JSX.Element => {
  return (
    <FlexLayout
      direction="row"
      align="center"
      justify="between"
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
      style={{ paddingLeft: 'var(--spacing-xl)', paddingRight: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', paddingBottom: 'var(--spacing-lg)' }}
    >
      <FlexLayout direction="row" align="center" gap="lg">
        <Avatar size="lg" className="bg-primary/10">
          <Bot className="text-primary" style={{ height: 'var(--icon-xl)', width: 'var(--icon-xl)' }} />
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </FlexLayout>
      <FlexLayout direction="row" align="center" gap="md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction?.('refresh')}
          className="rounded-2xl" style={{ height: 'var(--button-lg)', width: 'var(--button-lg)' }}
          aria-label="Refresh conversation"
        >
          <RefreshCw style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
        </Button>
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="rounded-2xl" style={{ height: 'var(--button-lg)', width: 'var(--button-lg)' }}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
            ) : (
              <Maximize2 style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction?.('menu')}
          className="rounded-2xl" style={{ height: 'var(--button-lg)', width: 'var(--button-lg)' }}
          aria-label="More options"
        >
          <MoreVertical style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
        </Button>
      </FlexLayout>
    </FlexLayout>
  );
};

/**
 * Chat message component
 */
const ChatMessage = ({ message, isLast }: ChatMessageProps): JSX.Element => {
  const isUser = message.role === 'user';

  return (
    <FlexLayout
      direction="row"
      align="start"
      gap="md"
      className={cn(
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar size="md" className={cn(isUser ? 'bg-primary' : 'bg-primary/10')}>
        {isUser ? (
          <User className="text-primary-foreground" style={{ height: 'var(--icon-lg)', width: 'var(--icon-lg)' }} />
        ) : (
          <Bot className="text-primary" style={{ height: 'var(--icon-lg)', width: 'var(--icon-lg)' }} />
        )}
      </Avatar>
      <FlexLayout
        direction="column"
        gap="md"
        className={cn(
          'max-w-[70%]',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-2xl',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
          style={{ padding: 'var(--spacing-lg)' }}
        >
          <p className="text-lg whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <FlexLayout direction="column" gap="md" style={{ marginTop: 'var(--spacing-lg)' }}>
              {message.attachments.map((attachment) => (
                <FlexLayout
                  key={attachment.id}
                  direction="row"
                  align="center"
                  gap="md"
                  className={cn(
                    'rounded-2xl',
                    isUser ? 'bg-primary-foreground/10' : 'bg-background/50'
                  )}
                  style={{ padding: 'var(--spacing-md)' }}
                >
                  {attachment.type === 'image' ? (
                    <ImageIcon style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
                  ) : (
                    <FileText style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
                  )}
                  <span className="text-lg truncate">{attachment.name}</span>
                  <span className="text-lg opacity-70">
                    ({(attachment.size / 1024).toFixed(1)}KB)
                  </span>
                </FlexLayout>
              ))}
            </FlexLayout>
          )}
        </div>
        <p className="text-lg text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.status === 'sending' && ' • Sending...'}
          {message.status === 'error' && ' • Failed to send'}
        </p>
      </FlexLayout>
    </FlexLayout>
  );
};

/**
 * Chat input component
 */
const ChatInput = ({
  onSend,
  placeholder,
  disabled,
  attachmentsEnabled,
  voiceEnabled,
  className,
}: ChatInputProps): JSX.Element => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() || attachments.length > 0) {
      onSend(input.trim(), attachments);
      setInput('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = files.map((file) => ({
      id: Math.random().toString(36).slice(2),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      size: file.size,
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <FlexLayout direction="column" gap="lg" className={cn(className)}>
      {attachments.length > 0 && (
        <FlexLayout direction="row" wrap gap="md">
          {attachments.map((attachment) => (
            <FlexLayout
              key={attachment.id}
              direction="row"
              align="center"
              gap="md"
              className="bg-muted rounded-2xl"
              style={{ paddingLeft: 'var(--spacing-lg)', paddingRight: 'var(--spacing-lg)', paddingTop: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)' }}
            >
              {attachment.type === 'image' ? (
                <ImageIcon style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
              ) : (
                <FileText style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
              )}
              <span className="text-lg truncate max-w-[150px]">
                {attachment.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAttachment(attachment.id)}
                className="rounded-2xl" style={{ height: 'var(--button-md)', width: 'var(--button-md)' }}"
              >
                <X style={{ height: 'var(--icon-sm)', width: 'var(--icon-sm)' }} />
              </Button>
            </FlexLayout>
          ))}
        </FlexLayout>
      )}
      <FlexLayout direction="row" align="end" gap="md">
        {attachmentsEnabled && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="rounded-2xl" style={{ height: 'var(--button-lg)', width: 'var(--button-lg)' }}"
              aria-label="Attach file"
            >
              <Paperclip style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
            </Button>
          </>
        )}
        <div className="flex-1 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="rounded-2xl text-lg" style={{ height: 'var(--button-xl)', paddingRight: 'var(--spacing-3xl)' }}"
            autoComplete="off"
          />
          {voiceEnabled && (
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute top-1/2 -translate-y-1/2 rounded-2xl" style={{ right: 'var(--spacing-sm)', height: 'var(--button-lg)', width: 'var(--button-lg)' }}"
              aria-label="Voice input"
            >
              <Mic style={{ height: 'var(--icon-md)', width: 'var(--icon-md)' }} />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="rounded-2xl shadow-xl" style={{ height: 'var(--button-xl)', paddingLeft: 'var(--spacing-xl)', paddingRight: 'var(--spacing-xl)' }}"
          style={{ paddingLeft: 'var(--spacing-2xl)', paddingRight: 'var(--spacing-2xl)' }}
        >
          <Send style={{ height: 'var(--icon-lg)', width: 'var(--icon-lg)' }} />
        </Button>
      </FlexLayout>
    </FlexLayout>
  );
};

export { ChatHeader, ChatMessage, ChatInput };
export type { Message, Attachment };