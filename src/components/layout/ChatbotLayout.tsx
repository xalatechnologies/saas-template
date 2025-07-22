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
import { Button, Input, Avatar } from '../ui';
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
    <div
      className={cn(
        'flex flex-col bg-background',
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
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && welcomeMessage ? (
          <div className="max-w-3xl mx-auto">
            {welcomeMessage}
            {suggestions && suggestions.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4">Try asking:</p>
                <div className="flex flex-wrap gap-3">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => onSuggestionClick?.(suggestion)}
                      className="rounded-xl text-sm"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <Avatar size="sm" className="bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </Avatar>
                <div className="bg-muted rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput
            onSend={onSendMessage}
            placeholder={placeholder}
            disabled={isLoading}
            attachmentsEnabled
            voiceEnabled
          />
        </div>
      </div>
    </div>
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
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex items-center space-x-4">
        <Avatar size="md" className="bg-primary/10">
          <Bot className="h-6 w-6 text-primary" />
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction?.('refresh')}
          className="rounded-xl"
          aria-label="Refresh conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        {onToggleFullscreen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="rounded-xl"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAction?.('menu')}
          className="rounded-xl"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Chat message component
 */
const ChatMessage = ({ message, isLast }: ChatMessageProps): JSX.Element => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start space-x-3',
        isUser && 'flex-row-reverse space-x-reverse'
      )}
    >
      <Avatar size="sm" className={cn(isUser ? 'bg-primary' : 'bg-primary/10')}>
        {isUser ? (
          <User className="h-5 w-5 text-primary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary" />
        )}
      </Avatar>
      <div
        className={cn(
          'flex flex-col space-y-2 max-w-[70%]',
          isUser && 'items-end'
        )}
      >
        <div
          className={cn(
            'rounded-xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={cn(
                    'flex items-center space-x-2 p-2 rounded-lg',
                    isUser ? 'bg-primary-foreground/10' : 'bg-background/50'
                  )}
                >
                  {attachment.type === 'image' ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span className="text-xs truncate">{attachment.name}</span>
                  <span className="text-xs opacity-70">
                    ({(attachment.size / 1024).toFixed(1)}KB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.status === 'sending' && ' • Sending...'}
          {message.status === 'error' && ' • Failed to send'}
        </p>
      </div>
    </div>
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
    <div className={cn('space-y-3', className)}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2"
            >
              {attachment.type === 'image' ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span className="text-sm truncate max-w-[150px]">
                {attachment.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAttachment(attachment.id)}
                className="h-6 w-6 rounded"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-end space-x-2">
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
              className="rounded-xl"
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
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
            className="pr-12 rounded-xl min-h-[48px]"
            autoComplete="off"
          />
          {voiceEnabled && (
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className="absolute right-1 top-1 rounded-lg"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          onClick={handleSend}
          disabled={disabled || (!input.trim() && attachments.length === 0)}
          className="rounded-xl h-12 px-6 shadow-lg"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export { ChatHeader, ChatMessage, ChatInput };
export type { Message, Attachment };