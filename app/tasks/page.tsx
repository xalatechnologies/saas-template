'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import {
  BasePage,
  PageSection,
  ContentGrid,
  EmptyState,
  LoadingState,
  TaskCard,
  TaskForm,
  Button,
  Input,
  Badge,
} from '@/components';
import { useAuth, useTasks, useUI } from '@/hooks';
import type { TaskStatus, TaskPriority } from '@/types';

/**
 * Tasks page component for managing and viewing all tasks
 * @returns JSX.Element
 */
export default function TasksPage(): JSX.Element {
  const { user, requireAuth } = useAuth();
  const { tasks, fetchTasks, handleStatusChange, handleDeleteTask, isLoading } = useTasks();
  const { t } = useUI();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  // Redirect to login if not authenticated
  useEffect(() => {
    requireAuth();

    if (user) {
      fetchTasks();
    }
  }, [user, requireAuth, fetchTasks]);

  if (!user) {
    return <LoadingState message="Checking authentication..." />;
  }

  /**
   * Filters tasks based on search query and filter criteria
   */
  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  /**
   * Calculates task counts by status
   */
  const statusCounts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    cancelled: tasks.filter((t) => t.status === 'cancelled').length,
  };

  return (
    <BasePage
      title={t('tasks.title')}
      subtitle="Administrer og følg opp dine oppgaver"
      actions={<TaskForm />}
    >
      {/* Filters and Search */}
      <PageSection variant="card">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Status:</span>

            {/* Status Filter Buttons */}
            <div className="flex items-center space-x-1">
              {(['all', 'todo', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="relative"
                >
                  {status === 'all' ? 'Alle' : t(`tasks.${status}`)}
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-xs bg-background text-foreground"
                  >
                    {statusCounts[status]}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PageSection>

      {/* Task List */}
      <PageSection variant="transparent">
        {isLoading ? (
          <LoadingState message="Loading tasks..." />
        ) : filteredTasks.length > 0 ? (
          <ContentGrid columns={3} gap="md">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
                onEdit={(task) => {
                  console.log('Edit task:', task);
                }}
              />
            ))}
          </ContentGrid>
        ) : (
          <EmptyState
            icon={<Search className="h-6 w-6 text-muted-foreground" />}
            title="Ingen oppgaver funnet"
            description={
              searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Prøv å justere søket eller filtrene dine.'
                : 'Opprett din første oppgave for å komme i gang.'
            }
            action={
              !searchQuery && statusFilter === 'all' && priorityFilter === 'all' ? (
                <TaskForm />
              ) : undefined
            }
          />
        )}
      </PageSection>
    </BasePage>
  );
}
