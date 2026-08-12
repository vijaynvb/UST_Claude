export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];
export const TASK_STATUSES: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
