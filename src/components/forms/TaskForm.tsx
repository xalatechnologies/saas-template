'use client';

import React, { useState } from 'react';
import { Plus, Calendar, User, Tag } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
} from '../ui';
import { useFormValidation, useTasks, useUI } from '@/hooks';
import { createTaskSchema } from '@/utils';
import type { CreateTaskInput, TaskPriority } from '@/types';

interface TaskFormProps {
  readonly trigger?: React.ReactNode;
  readonly onSuccess?: () => void;
}

export const TaskForm = ({ trigger, onSuccess }: TaskFormProps): JSX.Element => {
  const { t } = useUI();
  const { createTask } = useTasks();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: undefined,
    tags: [],
  });

  const { errors, isSubmitting, handleSubmit, clearFieldError } = useFormValidation({
    schema: createTaskSchema,
    onSubmit: async (data: CreateTaskInput) => {
      await createTask(data);
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: undefined,
        tags: [],
      });
      onSuccess?.();
    },
  });

  const handleInputChange = (field: keyof CreateTaskInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    if (errors[field]) {
      clearFieldError(field);
    }
  };

  const handlePriorityChange = (priority: TaskPriority): void => {
    setFormData(prev => ({
      ...prev,
      priority,
    }));
  };

  const handleDateChange = (date: Date | undefined): void => {
    setFormData(prev => ({
      ...prev,
      dueDate: date,
    }));
  };

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await handleSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('tasks.create')}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('tasks.create')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <Label htmlFor="title" required>
              {t('tasks.title')}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleInputChange('title')}
              error={errors.title}
              placeholder="Skriv inn oppgavetittel..."
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">
              {t('tasks.description')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Beskriv oppgaven i detalj..."
              disabled={isSubmitting}
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-base text-destructive font-medium">{errors.description}</p>
            )}
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-3">
              <Label>
                <Tag className="mr-2 h-4 w-4 inline" />
                {t('tasks.priority')}
              </Label>
              <Select
                value={formData.priority}
                onValueChange={handlePriorityChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t('tasks.low')}</SelectItem>
                  <SelectItem value="medium">{t('tasks.medium')}</SelectItem>
                  <SelectItem value="high">{t('tasks.high')}</SelectItem>
                  <SelectItem value="urgent">{t('tasks.urgent')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-3">
              <Label>
                <Calendar className="mr-2 h-4 w-4 inline" />
                {t('tasks.dueDate')}
              </Label>
              <DatePicker
                date={formData.dueDate}
                onDateChange={handleDateChange}
                placeholder="Velg forfallsdato"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t('forms.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('common.loading') : t('forms.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};