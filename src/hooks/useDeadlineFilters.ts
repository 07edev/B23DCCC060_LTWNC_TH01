import { useMemo, useState } from 'react';
import type { Deadline, Filter } from '../features/deadlines/deadlinesTypes';

const isOverdue = (date: string) => new Date(`${date}T23:59:59`) < new Date();

export const useDeadlineFilters = (items: Deadline[]) => {
  const [filter, setFilter] = useState<Filter>('all');
  const filteredItems = useMemo(() => sortDeadlinesByUrgency(items.filter((item) => {
    if (filter === 'completed') return item.completed;
    if (filter === 'pending') return !item.completed && !isOverdue(item.dueDate);
    if (filter === 'overdue') return !item.completed && isOverdue(item.dueDate);
    return true;
  })), [filter, items]);
  return { filter, setFilter, filteredItems };
};

export const getDaysLabel = (date: string) => {
  const today = new Date();
  const due = new Date(`${date}T23:59:59`);
  const days = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (days < 0) return { text: `Quá hạn ${Math.abs(days)} ngày`, overdue: true };
  if (days === 0) return { text: 'Đến hạn hôm nay', overdue: false };
  return { text: `Còn ${days} ngày`, overdue: false };
};

const getDueTimestamp = (date: string) => new Date(`${date}T23:59:59`).getTime();
const priorityWeight = { high: 0, medium: 1, low: 2 };

export type DeadlineUrgency = 'overdue' | 'urgent' | 'normal' | 'completed';

export const getUrgency = (deadline: Pick<Deadline, 'dueDate' | 'priority' | 'completed'>): DeadlineUrgency => {
  const days = Math.ceil((getDueTimestamp(deadline.dueDate) - Date.now()) / 86400000);
  if (deadline.completed) return 'completed';
  if (days < 0) return 'overdue';
  if (days <= 2 || deadline.priority === 'high') return 'urgent';
  return 'normal';
};

const urgencyWeight = { overdue: 0, urgent: 1, normal: 2, completed: 3 };

export const sortDeadlinesByUrgency = (items: Deadline[]) => [...items].sort((first, second) => {
  const urgencyDifference = urgencyWeight[getUrgency(first)] - urgencyWeight[getUrgency(second)];
  if (urgencyDifference !== 0) return urgencyDifference;
  const dueDifference = getDueTimestamp(first.dueDate) - getDueTimestamp(second.dueDate);
  if (dueDifference !== 0) return dueDifference;
  return priorityWeight[first.priority] - priorityWeight[second.priority];
});
