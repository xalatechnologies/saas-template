'use client';

import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { 
  BasePage, 
  PageSection, 
  ContentGrid, 
  EmptyState,
  LoadingState,
  TaskStats, 
  TaskCard, 
  TaskForm, 
  Button,
  AppText
} from '@/components';
import { useAuth, useTasks, useUI } from '@/hooks';

/**
 * Dashboard page component - main application entry point
 * @returns React element with dashboard content
 */
export default function DashboardPage(): React.ReactElement {
  const { user, requireAuth } = useAuth();
  const { tasks, fetchTasks, getTasksStats, handleStatusChange } = useTasks();
  const { t } = useUI();

  // Redirect to login if not authenticated
  useEffect(() => {
    requireAuth();
    
    if (user) {
      fetchTasks();
    }
  }, [user, requireAuth, fetchTasks]);

  // Don't render anything while checking auth
  if (!user) {
    return <LoadingState message="Checking authentication..." />;
  }

  const stats = getTasksStats();
  const recentTasks = tasks.slice(0, 6); // Show 6 most recent tasks

  return (
    <BasePage
      title={`${t('dashboard.welcome')}, ${user.name}! 👋`}
      subtitle={t('dashboard.overview')}
    >
      {/* Stats Overview */}
      <PageSection variant="transparent">
        <TaskStats stats={stats} />
      </PageSection>

      {/* Main Content Grid */}
      <ContentGrid columns={3} gap="lg">
        {/* Recent Tasks - spans 2 columns */}
        <div className="lg:col-span-2">
          <PageSection 
            variant="card"
            title={t('dashboard.recentTasks')}
            actions={
              <Button variant="outline" size="sm">
                {t('dashboard.viewAll')}
              </Button>
            }
          >
            {recentTasks.length > 0 ? (
              <ContentGrid columns={2} gap="md">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </ContentGrid>
            ) : (
              <EmptyState
                icon={<Plus className="h-6 w-6 text-muted-foreground" />}
                title={t('tasks.noTasksYet')}
                description={t('tasks.createFirstTask')}
                action={<TaskForm />}
              />
            )}
          </PageSection>
        </div>
        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <PageSection 
            variant="card"
            title={t('dashboard.quickActions')}
          >
            <div className="space-y-3">
              <TaskForm 
                trigger={
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('dashboard.createTask')}
                  </Button>
                }
              />
              <Button className="w-full justify-start" variant="outline">
                {t('tasks.filter')}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {t('common.generateReport')}
              </Button>
              <Button className="w-full justify-start" variant="outline">
                {t('common.import')}
              </Button>
            </div>
          </PageSection>

          <PageSection 
            variant="card"
            title={t('common.thisWeek')}
          >
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <AppText variant="muted">{t('dashboard.completedTasks')}</AppText>
                <AppText className="font-medium text-foreground">{stats.completed}</AppText>
              </div>
              <div className="flex justify-between text-sm">
                <AppText variant="muted">{t('tasks.new')}</AppText>
                <AppText className="font-medium text-foreground">3</AppText>
              </div>
              <div className="flex justify-between text-sm">
                <AppText variant="muted">{t('dashboard.overdueTasks')}</AppText>
                <AppText className="font-medium text-destructive">{stats.overdue}</AppText>
              </div>
            </div>
          </PageSection>
        </div>
      </ContentGrid>
    </BasePage>
  );
}