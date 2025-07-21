'use client';

import React from 'react';
import { CheckCircle, Clock, AlertTriangle, List } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import { useUI } from '@/hooks';

/**
 * Task statistics props interface
 */
interface TaskStatsProps {
  readonly stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

/**
 * Task statistics dashboard component
 * @param props - Task statistics component properties
 * @returns JSX.Element
 */
export const TaskStats = ({ stats }: TaskStatsProps): JSX.Element => {
  const { t } = useUI();

  /**
   * Statistics items configuration
   */
  const statItems = [
    {
      label: t('dashboard.totalTasks'),
      value: stats.total,
      icon: List,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: t('dashboard.completedTasks'),
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      label: t('dashboard.inProgressTasks'),
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: t('dashboard.overdueTasks'),
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <Card key={item.label} className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className={`rounded-2xl p-3 shadow-lg ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-black text-foreground mb-2">{item.value}</div>
              <p className="text-sm text-muted-foreground font-medium">
                {item.value === stats.total 
                  ? t('dashboard.totalTasks')
                  : `${stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}% av totalt`
                }
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};