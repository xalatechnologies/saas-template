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
    readonly total: number;
    readonly completed: number;
    readonly inProgress: number;
    readonly overdue: number;
  };
}

/**
 * Task statistics dashboard component
 * @param props - Task statistics component properties
 * @returns React.ReactElement
 */
export const TaskStats = ({ stats }: TaskStatsProps): React.ReactElement => {
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
      color: 'text-chart-5',
      bgColor: 'bg-chart-5/10',
    },
    {
      label: t('dashboard.inProgressTasks'),
      value: stats.inProgress,
      icon: Clock,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
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
          <Card
            key={item.label}
            className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base font-semibold text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className={`rounded-xl p-3 shadow-md ${item.bgColor}`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-4xl font-black text-foreground mb-2">{item.value}</div>
              <p className="text-sm text-muted-foreground font-medium">
                {item.value === stats.total
                  ? t('dashboard.totalTasks')
                  : `${stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}% av totalt`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
