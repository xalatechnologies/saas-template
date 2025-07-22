'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Minimize2,
  Send,
  Bot,
  User,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Avatar, Badge, FlexLayout, Container } from '@/components';
import { cn } from '@/utils';
import type { Message } from './ChatbotLayout';

interface ChatbotSidebarProps {
  readonly messages: Message[];
  readonly onSendMessage: (content: string) => void;
  readonly isLoading?: boolean;
  readonly placeholder?: string;
  readonly position?: 'left' | 'right';
  readonly defaultOpen?: boolean;
  readonly title?: string;
  readonly subtitle?: string;
  readonly showBadge?: boolean;
  readonly unreadCount?: number;
  readonly className?: string;
}

interface FloatingChatButtonProps {
  readonly onClick: () => void;
  readonly position?: 'bottom-left' | 'bottom-right';
  readonly unreadCount?: number;
  readonly className?: string;
}

interface MinimizedChatProps {
  readonly onClick: () => void;
  readonly title: string;
  readonly lastMessage?: string;
  readonly unreadCount?: number;
  readonly className?: string;
}

/**
 * Sidebar chatbot layout component
 * @returns JSX.Element
 */
export const ChatbotSidebar = ({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = 'Type your message...',
  position = 'right',
  defaultOpen = false,
  title = 'Chat Support',
  subtitle = 'We typically reply in minutes',
  showBadge = true,
  unreadCount = 0,
  className,
}: ChatbotSidebarProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // You would call a function here to reset unread count
    }
  }, [isOpen, isMinimized]);

  if (!isOpen) {
    return (
      <FloatingChatButton
        onClick={() => setIsOpen(true)}
        position={position === 'right' ? 'bottom-right' : 'bottom-left'}
        unreadCount={unreadCount}
      />
    );
  }

  if (isMinimized) {
    return (
      <MinimizedChat
        onClick={() => setIsMinimized(false)}
        title={title}
        lastMessage={messages[messages.length - 1]?.content}
        unreadCount={unreadCount}
        className={cn(
          'fixed bottom-4',
          position === 'right' ? 'right-4' : 'left-4'
        )}
      />
    );
  }

  return (
    <FlexLayout
      direction="column"
      className={cn(
        'fixed bottom-4 z-50 w-96 h-[600px] bg-background rounded-2xl shadow-2xl border border-border overflow-hidden',
        position === 'right' ? 'right-4' : 'left-4',
        className
      )}
    >
      {/* Header */}
      <Container className="p-12 border-b border-border bg-card">
        <FlexLayout direction="row" align="center" justify="between">
          <FlexLayout direction="row" align="center" gap="lg">
          <Avatar size="md" className="bg-primary/10">
            <Bot className="h-8 w-8 text-primary" />
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {showBadge && (
            <Badge variant="success" className="text-base">
              Online
            </Badge>
          )}
          </FlexLayout>
          <FlexLayout direction="row" align="center" gap="xs">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Clear messages logic here
              console.log('Clear chat');
            }}
            className="h-12 w-12 rounded-2xl"
            aria-label="Clear chat"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-12 w-12 rounded-2xl"
            aria-label="Minimize chat"
          >
            <Minimize2 className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-12 w-12 rounded-2xl"
            aria-label="Close chat"
          >
            <X className="h-6 w-6" />
          </Button>
          </FlexLayout>
        </FlexLayout>
      </Container>

      {/* Messages */}
      <Container className="flex-1 overflow-y-auto py-12">
        <FlexLayout direction="column" gap="xl">
        {messages.length === 0 ? (
          <FlexLayout direction="column" align="center" justify="center" className="py-12">
            <Bot className="h-16 w-16 text-muted-foreground mb-6" />
            <p className="text-lg text-muted-foreground text-center">
              Start a conversation by typing a message below
            </p>
          </FlexLayout>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <FlexLayout direction="row" align="start" gap="sm">
                <Avatar size="md" className="bg-primary/10">
                  <Bot className="h-6 w-6 text-primary" />
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-bl-none px-6 py-4">
                  <FlexLayout direction="row" align="center" gap="xs">
                    <div className="h-3 w-3 bg-primary rounded-full animate-bounce" />
                    <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="h-3 w-3 bg-primary rounded-full animate-bounce delay-200" />
                  </FlexLayout>
                </div>
              </FlexLayout>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
        </FlexLayout>
      </Container>

      {/* Input */}
      <ChatQuickInput
        onSend={onSendMessage}
        placeholder={placeholder}
        disabled={isLoading}
      />
    </FlexLayout>
  );
};

/**
 * Floating chat button component
 */
const FloatingChatButton = ({
  onClick,
  position = 'bottom-right',
  unreadCount = 0,
  className,
}: FloatingChatButtonProps): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-4 z-50 h-20 w-20 rounded-full shadow-2xl hover:scale-110 transition-transform',
        position === 'bottom-right' ? 'right-4' : 'left-4',
        className
      )}
      aria-label="Open chat"
    >
      <MessageSquare className="h-10 w-10" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 h-8 w-8 bg-destructive text-destructive-foreground text-base rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

/**
 * Minimized chat component
 */
const MinimizedChat = ({
  onClick,
  title,
  lastMessage,
  unreadCount = 0,
  className,
}: MinimizedChatProps): JSX.Element => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-2xl shadow-xl p-8 w-96 text-left hover:shadow-2xl transition-shadow',
        className
      )}
    >
      <FlexLayout direction="row" align="center" justify="between" className="mb-4">
        <FlexLayout direction="row" align="center" gap="md">
          <Avatar size="md" className="bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </Avatar>
          <span className="font-semibold text-lg">{title}</span>
        </FlexLayout>
        <FlexLayout direction="row" align="center" gap="md">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-base">
              {unreadCount}
            </Badge>
          )}
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </FlexLayout>
      </FlexLayout>
      {lastMessage && (
        <p className="text-base text-muted-foreground truncate">{lastMessage}</p>
      )}
    </button>
  );
};

/**
 * Chat bubble component
 */
interface ChatBubbleProps {
  readonly message: Message;
}

const ChatBubble = ({ message }: ChatBubbleProps): JSX.Element => {
  const isUser = message.role === 'user';

  return (
    <FlexLayout
      direction="row"
      align="end"
      gap="md"
      className={cn(
        isUser && 'flex-row-reverse'
      )}
    >
      <Avatar size="md" className={cn(isUser ? 'bg-primary' : 'bg-primary/10')}>
        {isUser ? (
          <User className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Bot className="h-6 w-6 text-primary" />
        )}
      </Avatar>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-6 py-4',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        )}
      >
        <p className="text-lg whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            'text-base mt-2',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </FlexLayout>
  );
};

/**
 * Quick chat input component
 */
interface ChatQuickInputProps {
  readonly onSend: (content: string) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

const ChatQuickInput = ({
  onSend,
  placeholder,
  disabled,
}: ChatQuickInputProps): JSX.Element => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container className="p-8 border-t border-border bg-card">
      <FlexLayout direction="row" align="center" gap="md">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 rounded-2xl h-16 text-lg"
          autoComplete="off"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="rounded-2xl h-16 w-16"
        >
          <Send className="h-6 w-6" />
        </Button>
      </FlexLayout>
    </Container>
  );
};

export { FloatingChatButton, MinimizedChat, ChatBubble, ChatQuickInput };