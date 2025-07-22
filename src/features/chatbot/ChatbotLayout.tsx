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
        isFullscreen ? 'fixed inset-0 z-50' : 'h-[calc(100vh-5rem)]',
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
      <Container size="xl" className="flex-1 overflow-y-auto py-12">
        {messages.length === 0 && welcomeMessage ? (
          <div className="max-w-3xl mx-auto">
            {welcomeMessage}
            {suggestions && suggestions.length > 0 && (
              <div className="mt-16">
                <p className="text-lg text-muted-foreground mb-8">Try asking:</p>
                <FlexLayout direction="row" wrap gap="md">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="rounded-2xl text-lg h-16 px-8"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </FlexLayout>
              </div>
            )}
          </div>
        ) : (
          <FlexLayout direction="column" gap="xl" className="max-w-3xl mx-auto">
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
                  <Bot className="h-8 w-8 text-primary" />
                </Avatar>
                <div className="bg-muted rounded-2xl px-8 py-6">
                  <FlexLayout direction="row" align="center" gap="md">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg text-muted-foreground">Thinking...</span>
                  </FlexLayout>
                </div>
              </FlexLayout>
            )}
            <div ref={messagesEndRef} />
          </FlexLayout>
        )}
      </Container>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container size="lg" className="py-8">
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
        'px-12 py-8 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <FlexLayout direction="row" align="center" gap="lg">
        <Avatar size="lg" className="bg-primary/10">
          <Bot className="h-10 w-10 text-primary" />
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
          className="rounded-2xl h-12 w-12"
          aria-label="Refresh conversation"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="rounded-2xl h-12 w-12"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction?.('menu')}
          className="rounded-2xl h-12 w-12"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
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
          <User className="h-8 w-8 text-primary-foreground" />
        ) : (
          <Bot className="h-8 w-8 text-primary" />
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
            'rounded-2xl px-8 py-6',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <p className="text-lg whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <FlexLayout direction="column" gap="md" className="mt-6">
              {message.attachments.map((attachment) => (
                <FlexLayout
                  key={attachment.id}
                  direction="row"
                  align="center"
                  gap="md"
                  className={cn(
                    'p-6 rounded-2xl',
                    isUser ? 'bg-primary-foreground/10' : 'bg-background/50'
                  )}
                >
                  {attachment.type === 'image' ? (
                    <ImageIcon className="h-6 w-6" />
                  ) : (
                    <FileText className="h-6 w-6" />
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
              className="bg-muted rounded-2xl px-6 py-4"
            >
              {attachment.type === 'image' ? (
                <ImageIcon className="h-6 w-6" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              <span className="text-lg truncate max-w-[150px]">
                {attachment.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAttachment(attachment.id)}
                className="h-12 w-12 rounded-2xl"
              >
                <X className="h-5 w-5" />
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
              className="rounded-2xl h-12 w-12"
              aria-label="Attach file"
            >
              <Paperclip className="h-6 w-6" />
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
            className="pr-20 rounded-2xl h-20 text-lg"
            autoComplete="off"
          />
          {voiceEnabled && (
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-2xl h-16 w-16"
              aria-label="Voice input"
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="rounded-2xl h-20 px-12 shadow-xl"
        >
          <Send className="h-8 w-8" />
        </Button>
      </FlexLayout>
    </FlexLayout>
  );
};

export { ChatHeader, ChatMessage, ChatInput };
export type { Message, Attachment };