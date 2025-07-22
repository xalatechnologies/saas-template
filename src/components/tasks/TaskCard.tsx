'use client';

import React from 'react';
import { Calendar, User, MoreHorizontal } from 'lucide-react';
import { useUI } from '@/hooks';
import type { Task } from '@/types';
import { formatDate, isOverdue, isDueToday } from '@/utils';
import { Card, CardContent, Badge, Avatar, Button } from '../ui';

/**
 * Task card component props interface
 */
interface TaskCardProps {
  readonly task: Task;
  readonly onEdit?: (task: Task) => void;
  readonly onDelete?: (taskId: string) => void;
  readonly onStatusChange?: (taskId: string, status: Task['status']) => void;
}

/**
 * Task card component for displaying individual task information
 * @param props - Task card component properties
 * @returns React.ReactElement
 */
export const TaskCard = ({
  task,
  // onEdit,
  // onDelete,
  onStatusChange,
}: TaskCardProps): React.ReactElement => {
  const { t } = useUI();

  /**
   * Gets badge variant based on task priority
   * @param priority - Task priority level
   * @returns Badge variant string
   */
  const getPriorityColor = (
    priority: Task['priority'],
  ): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  /**
   * Gets badge variant based on task status
   * @param status - Task status
   * @returns Badge variant string
   */
  const getStatusColor = (
    status: Task['status'],
  ): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'todo':
      default:
        return 'secondary';
    }
  };

  /**
   * Gets due date status information
   * @param dueDate - Task due date
   * @returns Due date status object
   */
  const getDueDateStatus = (dueDate?: Date): { color: string; text: string } => {
    if (!dueDate) return { color: 'secondary', text: '' };

    if (isOverdue(dueDate)) {
      return { color: 'destructive', text: 'Overdue' };
    }

    if (isDueToday(dueDate)) {
      return { color: 'default', text: t('common.today') };
    }

    return { color: 'secondary', text: formatDate(dueDate) };
  };

  /**
   * Handles task status toggle between completed and todo
   */
  const handleStatusToggle = (): void => {
    if (onStatusChange) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      onStatusChange(task.id, newStatus);
    }
  };

  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`font-semibold line-clamp-2 ${
                  task.status === 'completed' ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-3 text-base text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="default"
              className="h-10 w-10 shrink-0"
              aria-label={t('common.moreOptions')}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <Badge variant={getStatusColor(task.status)} className="text-sm">
              {t(`tasks.${task.status}`)}
            </Badge>
            <Badge variant={getPriorityColor(task.priority)} className="text-sm">
              {t(`tasks.${task.priority}`)}
            </Badge>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-border">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className={dueDateStatus.color === 'destructive' ? 'text-destructive' : ''}>
                    {dueDateStatus.text}
                  </span>
                </div>
              )}

              {/* Assignee */}
              {task.assignee && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{task.assignee.name}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {task.assignee && (
                <Avatar
                  src={task.assignee.avatar}
                  alt={task.assignee.name}
                  fallback={task.assignee.name.charAt(0).toUpperCase()}
                  size="md"
                />
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleStatusToggle}
                className="text-sm font-medium"
              >
                {task.status === 'completed' ? t('tasks.markIncomplete') : t('tasks.markComplete')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
