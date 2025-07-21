import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '@/types';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, updates: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Selectors
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getOverdueTasks: () => Task[];
  getTasksStats: () => {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement user authentication',
    description: 'Set up secure login and registration system with JWT tokens',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '1',
    dueDate: new Date('2025-01-30'),
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-01-20'),
    tags: ['auth', 'security'],
  },
  {
    id: '2',
    title: 'Design task dashboard',
    description: 'Create a modern and intuitive dashboard for task management',
    status: 'completed',
    priority: 'medium',
    assigneeId: '1',
    dueDate: new Date('2025-01-25'),
    createdAt: new Date('2025-01-18'),
    updatedAt: new Date('2025-01-22'),
    tags: ['design', 'ui'],
  },
  {
    id: '3',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment workflows',
    status: 'todo',
    priority: 'high',
    dueDate: new Date('2025-01-28'),
    createdAt: new Date('2025-01-19'),
    updatedAt: new Date('2025-01-19'),
    tags: ['devops', 'automation'],
  },
];

export const useTaskStore = create<TaskStore>()(
  immer((set, get) => ({
    tasks: mockTasks,
    isLoading: false,
    error: null,

    fetchTasks: async (): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          state.tasks = mockTasks;
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to fetch tasks';
          state.isLoading = false;
        });
      }
    },

    createTask: async (taskInput: CreateTaskInput): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const newTask: Task = {
          id: Date.now().toString(),
          ...taskInput,
          status: 'todo',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: taskInput.tags || [],
        };

        set((state) => {
          state.tasks.push(newTask);
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to create task';
          state.isLoading = false;
        });
      }
    },

    updateTask: async (id: string, updates: UpdateTaskInput): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          const taskIndex = state.tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            state.tasks[taskIndex] = {
              ...state.tasks[taskIndex],
              ...updates,
              updatedAt: new Date(),
            };
          }
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to update task';
          state.isLoading = false;
        });
      }
    },

    deleteTask: async (id: string): Promise<void> => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        set((state) => {
          state.tasks = state.tasks.filter((task) => task.id !== id);
          state.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Failed to delete task';
          state.isLoading = false;
        });
      }
    },

    setLoading: (loading: boolean): void => {
      set((state) => {
        state.isLoading = loading;
      });
    },

    setError: (error: string | null): void => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: (): void => {
      set((state) => {
        state.error = null;
      });
    },

    getTasksByStatus: (status: TaskStatus): Task[] => {
      return get().tasks.filter((task) => task.status === status);
    },

    getTasksByPriority: (priority: TaskPriority): Task[] => {
      return get().tasks.filter((task) => task.priority === priority);
    },

    getOverdueTasks: (): Task[] => {
      const now = new Date();
      return get().tasks.filter(
        (task) => task.dueDate && task.dueDate < now && task.status !== 'completed'
      );
    },

    getTasksStats: () => {
      const tasks = get().tasks;
      const now = new Date();
      
      return {
        total: tasks.length,
        completed: tasks.filter((task) => task.status === 'completed').length,
        inProgress: tasks.filter((task) => task.status === 'in-progress').length,
        overdue: tasks.filter(
          (task) => task.dueDate && task.dueDate < now && task.status !== 'completed'
        ).length,
      };
    },
  }))
);