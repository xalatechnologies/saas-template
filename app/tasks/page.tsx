import React from 'react';
import type { Metadata } from 'next';
import { TasksContent } from '@/components';

/**
 * Metadata for the tasks page
 */
export const metadata: Metadata = {
  title: 'Oppgaver',
  description: 'Administrer og spor alle oppgaver',
};

/**
 * Tasks page server component
 * @returns React element for tasks page
 */
export default function TasksPage(): React.ReactElement {
  return <TasksContent />;
}
