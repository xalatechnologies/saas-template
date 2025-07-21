import { z } from 'zod';

// Norwegian personal number validation
export const validateNorwegianPersonalNumber = (personalNumber: string): boolean => {
  // Remove spaces and hyphens
  const cleaned = personalNumber.replace(/[\s-]/g, '');

  // Check if it's 11 digits
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  // Extract components
  const day = parseInt(cleaned.substring(0, 2), 10);
  const month = parseInt(cleaned.substring(2, 4), 10);
  const year = parseInt(cleaned.substring(4, 6), 10);
  const individual = parseInt(cleaned.substring(6, 9), 10);
  const control = cleaned.substring(9, 11);

  // Basic date validation
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Calculate control digits using the standard Norwegian algorithm
  const weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
  const weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];

  const digits = cleaned.substring(0, 9).split('').map(Number);

  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * weights1[i];
  }

  const control1 = (11 - (sum1 % 11)) % 11;
  if (control1 === 10) return false;

  const allDigits = [...digits, control1];
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += allDigits[i] * weights2[i];
  }

  const control2 = (11 - (sum2 % 11)) % 11;
  if (control2 === 10) return false;

  return control === `${control1}${control2}`;
};

// Task validation schemas
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigneeId: z.string().optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['todo', 'in-progress', 'completed', 'cancelled']).optional(),
});

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[a-z]/, 'Password must contain lowercase letter')
      .regex(/\d/, 'Password must contain number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords don&apos;t match',
    path: ['confirmPassword'],
  });

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Norwegian postal code validation
export const isValidNorwegianPostalCode = (postalCode: string): boolean => {
  return /^\d{4}$/.test(postalCode);
};
