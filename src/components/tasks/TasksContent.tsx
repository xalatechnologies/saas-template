'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import {
  BasePage,
  PageSection,
  GridLayout,
  EmptyState,
  LoadingState,
  TaskCard,
  TaskForm,
  Button,
  Input,
  Badge,
} from '@/components';
import { useAuth, useTasks, useUI } from '@/hooks';
import type { Task, TaskStatus, TaskPriority } from '@/types';

/**
 * Tasks content component for managing and viewing all tasks
 * @returns React element with task list, filters, and actions
 */
export const TasksContent = (): React.ReactElement => {
  const { user, requireAuth } = useAuth();
  const { tasks, fetchTasks, handleStatusChange, handleDeleteTask, isLoading } = useTasks();
  const { t } = useUI();

  const [searchQuery, setSearchQuery] = useState('');
  // Define status and priority filter types to include 'all'
  type StatusFilterType = TaskStatus | 'all';
  type PriorityFilterType = TaskPriority | 'all';

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, fetchTasks]);

  /**
   * Filters tasks based on search and filter criteria
   * @returns Filtered task array
   */
  const filteredTasks = tasks.filter((task: Task) => {
    // Search query filter
    const matchesSearch =
      !searchQuery ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    // Status filter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;

    // Priority filter
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  /**
   * Toggles add task form visibility
   */
  const toggleAddForm = (): void => {
    setShowAddForm((prev) => !prev);
  };

  /**
   * Handler for task form submission success
   */
  const handleTaskAdded = (): void => {
    setShowAddForm(false);
    fetchTasks();
  };

  return (
    <BasePage
      title={t('tasks.title')}
      subtitle={t('tasks.subtitle')}
      actions={
        <Button onClick={toggleAddForm}>
          <Plus aria-hidden="true" />
          <span>{t('tasks.addNew')}</span>
        </Button>
      }
    >
      {/* Add Task Form */}
      {showAddForm && (
        <PageSection variant="card">
          <PageSection variant="transparent" className="space-y-4">
            <TaskForm onSuccess={handleTaskAdded} />
            <Button variant="outline" onClick={toggleAddForm}>
              {t('common.cancel')}
            </Button>
          </PageSection>
        </PageSection>
      )}

      {/* Filters */}
      <PageSection variant="card" title={t('tasks.filters.title')}>
        <GridLayout columns={{ mobile: 1 }} gap="md">
          {/* Search input */}
          <Input
            placeholder={t('tasks.filters.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search aria-hidden="true" />}
          />

          <PageSection variant="transparent" title={t('tasks.filters.status')}>
            <GridLayout columns={{ mobile: 2, tablet: 4 }} gap="sm">
              <Badge
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className="cursor-pointer"
              >
                {t('common.all')}
              </Badge>
              <Badge
                variant={statusFilter === 'todo' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('todo')}
                className="cursor-pointer"
              >
                {t('tasks.status.pending')}
              </Badge>
              <Badge
                variant={statusFilter === 'in-progress' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('in-progress')}
                className="cursor-pointer"
              >
                {t('tasks.status.inProgress')}
              </Badge>
              <Badge
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('completed')}
                className="cursor-pointer"
              >
                {t('tasks.status.completed')}
              </Badge>
            </GridLayout>
          </PageSection>

          <PageSection variant="transparent" title={t('tasks.filters.priority')}>
            <GridLayout columns={{ mobile: 2, tablet: 4 }} gap="sm">
              <Badge
                variant={priorityFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setPriorityFilter('all')}
                className="cursor-pointer"
              >
                {t('common.all')}
              </Badge>
              <Badge
                variant={priorityFilter === 'low' ? 'default' : 'outline'}
                onClick={() => setPriorityFilter('low')}
                className="cursor-pointer"
              >
                {t('tasks.priority.low')}
              </Badge>
              <Badge
                variant={priorityFilter === 'medium' ? 'default' : 'outline'}
                onClick={() => setPriorityFilter('medium')}
                className="cursor-pointer"
              >
                {t('tasks.priority.medium')}
              </Badge>
              <Badge
                variant={priorityFilter === 'high' ? 'default' : 'outline'}
                onClick={() => setPriorityFilter('high')}
                className="cursor-pointer"
              >
                {t('tasks.priority.high')}
              </Badge>
            </GridLayout>
          </PageSection>
        </GridLayout>
      </PageSection>

      {/* Task List */}
      <PageSection variant="transparent">
        {isLoading ? (
          <LoadingState />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={<Filter aria-hidden="true" />}
            title={t('tasks.empty.title')}
            description={t('tasks.empty.message')}
            action={
              <Button onClick={toggleAddForm} variant="default">
                <Plus aria-hidden="true" />
                <span>{t('tasks.addNew')}</span>
              </Button>
            }
          />
        ) : (
          <GridLayout columns={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </GridLayout>
        )}
      </PageSection>
    </BasePage>
  );
};
