import { useCallback } from 'react';
import { useTaskStore } from '@/store';
import type { CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '@/types';

export const useTasks = () => {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    getTasksStats,
    clearError,
  } = useTaskStore();

  const handleCreateTask = useCallback(
    async (taskData: CreateTaskInput): Promise<void> => {
      try {
        await createTask(taskData);
      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      }
    },
    [createTask],
  );

  const handleUpdateTask = useCallback(
    async (id: string, updates: UpdateTaskInput): Promise<void> => {
      try {
        await updateTask(id, updates);
      } catch (error) {
        console.error('Failed to update task:', error);
        throw error;
      }
    },
    [updateTask],
  );

  const handleDeleteTask = useCallback(
    async (id: string): Promise<void> => {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
        throw error;
      }
    },
    [deleteTask],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: TaskStatus): Promise<void> => {
      try {
        await updateTask(id, { status });
      } catch (error) {
        console.error('Failed to update task status:', error);
        throw error;
      }
    },
    [updateTask],
  );

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    handleDeleteTask,
    handleStatusChange,
    getTasksByStatus,
    getTasksByPriority,
    getOverdueTasks,
    getTasksStats,
    clearError,
  };
};
