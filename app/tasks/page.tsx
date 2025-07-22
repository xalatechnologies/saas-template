'use client';

import React from 'react';
import { TasksContent, AuthGuard } from '@/components';

/**
 * Tasks page server component
 * @returns React element for tasks page
 */
export default function TasksPage(): React.ReactElement {
  return (
    <AuthGuard>
      <TasksContent />
    </AuthGuard>
  );
}
