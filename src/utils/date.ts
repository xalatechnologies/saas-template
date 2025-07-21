import { format, formatDistanceToNow, isValid, parseISO, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';
import { nb, enUS, fr, ar } from 'date-fns/locale';

const locales = {
  no: nb,
  en: enUS,
  fr: fr,
  ar: ar,
};

export const formatDate = (date: Date | string, formatString = 'dd/MM/yyyy', language = 'no'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }

  return format(dateObj, formatString, {
    locale: locales[language as keyof typeof locales] || locales.no,
  });
};

export const formatRelativeTime = (date: Date | string, language = 'no'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return '';
  }

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: locales[language as keyof typeof locales] || locales.no,
  });
};

export const isOverdue = (dueDate: Date | string): boolean => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  
  if (!isValid(dateObj)) {
    return false;
  }

  return isBefore(dateObj, startOfDay(new Date()));
};

export const isDueToday = (dueDate: Date | string): boolean => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  
  if (!isValid(dateObj)) {
    return false;
  }

  const today = new Date();
  return (
    isAfter(dateObj, startOfDay(today)) &&
    isBefore(dateObj, endOfDay(today))
  );
};

export const isDueSoon = (dueDate: Date | string, days = 3): boolean => {
  const dateObj = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  
  if (!isValid(dateObj)) {
    return false;
  }

  const soonDate = new Date();
  soonDate.setDate(soonDate.getDate() + days);
  
  return isBefore(dateObj, endOfDay(soonDate)) && isAfter(dateObj, new Date());
};

export const getWeekNumber = (date: Date | string): number => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 0;
  }

  const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
  const pastDaysOfYear = (dateObj.getTime() - startOfYear.getTime()) / 86400000;
  
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};