'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Minimize2,
  Send,
  Bot,
  User,
  Loader2,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { Button, Input, Avatar, Badge } from '../ui';
import { cn } from '@/utils';
import type { Message, Attachment } from './ChatbotLayout';

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
    <div
      className={cn(
        'fixed bottom-4 z-50 w-96 h-[600px] bg-background rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden',
        position === 'right' ? 'right-4' : 'left-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <Avatar size="sm" className="bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {showBadge && (
            <Badge variant="success" className="text-xs">
              Online
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              // Clear messages logic here
              console.log('Clear chat');
            }}
            className="h-8 w-8 rounded-lg"
            aria-label="Clear chat"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 rounded-lg"
            aria-label="Minimize chat"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-lg"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-2">
                <Avatar size="xs" className="bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </Avatar>
                <div className="bg-muted rounded-xl rounded-bl-none px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <ChatQuickInput
        onSend={onSendMessage}
        placeholder={placeholder}
        disabled={isLoading}
      />
    </div>
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
        'fixed bottom-4 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform',
        position === 'bottom-right' ? 'right-4' : 'left-4',
        className
      )}
      aria-label="Open chat"
    >
      <MessageSquare className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
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
        'bg-card border border-border rounded-xl shadow-lg p-4 w-80 text-left hover:shadow-xl transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Avatar size="xs" className="bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </Avatar>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      {lastMessage && (
        <p className="text-xs text-muted-foreground truncate">{lastMessage}</p>
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
    <div
      className={cn(
        'flex items-end space-x-2',
        isUser && 'flex-row-reverse space-x-reverse'
      )}
    >
      <Avatar size="xs" className={cn(isUser ? 'bg-primary' : 'bg-primary/10')}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-primary" />
        )}
      </Avatar>
      <div
        className={cn(
          'max-w-[80%] rounded-xl px-3 py-2',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted text-foreground rounded-bl-none'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
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
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 rounded-xl"
          autoComplete="off"
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          size="icon"
          className="rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export { FloatingChatButton, MinimizedChat, ChatBubble, ChatQuickInput };