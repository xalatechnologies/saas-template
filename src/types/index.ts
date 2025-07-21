// User types
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// Task types
export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId?: string;
  readonly assignee?: User;
  readonly dueDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly tags: readonly string[];
}

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CreateTaskInput {
  readonly title: string;
  readonly description?: string;
  readonly priority: TaskPriority;
  readonly assigneeId?: string;
  readonly dueDate?: Date;
  readonly tags?: readonly string[];
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly status?: TaskStatus;
  readonly priority?: TaskPriority;
  readonly assigneeId?: string;
  readonly dueDate?: Date;
  readonly tags?: readonly string[];
}

// Auth types
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatar?: string;
}

export interface AuthState {
  readonly user: AuthUser | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

// API Response types
export interface ApiResponse<T> {
  readonly data: T;
  readonly message: string;
  readonly success: boolean;
}

export interface ApiError {
  readonly message: string;
  readonly code: string;
  readonly details?: Record<string, unknown>;
}

// Theme types
export type Theme = 'light' | 'dark';

// Language types
export type Language = 'no' | 'en' | 'fr' | 'ar';

// Norwegian compliance types
export interface SecurityClassification {
  readonly level: 'public' | 'internal' | 'confidential' | 'secret';
  readonly handling: string;
}

export interface NorwegianPersonalNumber {
  readonly value: string;
  readonly isValid: boolean;
}