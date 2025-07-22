import { Metadata } from 'next';
import { TasksContent } from '@/components';

export const metadata: Metadata = {
  title: 'Tasks | Task Management',
  description: 'Manage your tasks and projects efficiently',
};

export default function TasksPage() {
  return <TasksContent />;
}