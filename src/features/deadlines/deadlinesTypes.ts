export type Priority = 'high' | 'medium' | 'low';
export type Filter = 'all' | 'pending' | 'overdue' | 'completed';

export interface Deadline {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

export type NewDeadline = Omit<Deadline, 'id' | 'completed'>;

export const priorityLabels: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export const isPriority = (value: string): value is Priority =>
  value === 'high' || value === 'medium' || value === 'low';
