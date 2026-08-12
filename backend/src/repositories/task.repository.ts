import type { AppDatabase } from '../db/database';
import type { TaskPriority, TaskRow, TaskStatus } from '../models/task.model';

export interface CreateTaskInput {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTaskInput {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  updatedAt: string;
}

export interface TaskListFilter {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  pageSize: number;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDir: 'asc' | 'desc';
}

const PRIORITY_RANK_EXPRESSION = `
  CASE priority
    WHEN 'Low' THEN 0
    WHEN 'Medium' THEN 1
    WHEN 'High' THEN 2
    ELSE -1
  END
`;

function resolveSortColumn(sortBy: TaskListFilter['sortBy']): string {
  if (sortBy === 'priority') return PRIORITY_RANK_EXPRESSION;
  if (sortBy === 'dueDate') return 'due_date';
  return 'created_at';
}

export class TaskRepository {
  constructor(private readonly db: AppDatabase) {}

  findActiveById(id: string): TaskRow | undefined {
    return this.db
      .prepare('SELECT * FROM tasks WHERE id = ? AND deleted_at IS NULL')
      .get(id) as TaskRow | undefined;
  }

  create(input: CreateTaskInput): TaskRow {
    this.db
      .prepare(
        `INSERT INTO tasks (id, user_id, title, description, due_date, priority, status, deleted_at, created_at, updated_at)
         VALUES (@id, @userId, @title, @description, @dueDate, @priority, @status, NULL, @createdAt, @updatedAt)`,
      )
      .run(input);

    return this.findActiveById(input.id) as TaskRow;
  }

  update(id: string, input: UpdateTaskInput): TaskRow {
    this.db
      .prepare(
        `UPDATE tasks
         SET title = @title,
             description = @description,
             due_date = @dueDate,
             priority = @priority,
             status = @status,
             updated_at = @updatedAt
         WHERE id = @id`,
      )
      .run({ id, ...input });

    return this.findActiveById(id) as TaskRow;
  }

  updateStatus(id: string, status: TaskStatus, updatedAt: string): TaskRow {
    this.db
      .prepare('UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?')
      .run(status, updatedAt, id);

    return this.findActiveById(id) as TaskRow;
  }

  softDelete(id: string, deletedAt: string): void {
    this.db.prepare('UPDATE tasks SET deleted_at = ? WHERE id = ?').run(deletedAt, id);
  }

  list(filter: TaskListFilter): { items: TaskRow[]; totalItems: number } {
    const conditions = ['user_id = @userId', 'deleted_at IS NULL'];
    if (filter.status) conditions.push('status = @status');
    if (filter.priority) conditions.push('priority = @priority');
    const whereClause = conditions.join(' AND ');

    const params = {
      userId: filter.userId,
      status: filter.status,
      priority: filter.priority,
    };

    const totalItems = (
      this.db
        .prepare(`SELECT COUNT(*) AS count FROM tasks WHERE ${whereClause}`)
        .get(params) as { count: number }
    ).count;

    const sortColumn = resolveSortColumn(filter.sortBy);
    const sortDir = filter.sortDir === 'asc' ? 'ASC' : 'DESC';
    const offset = (filter.page - 1) * filter.pageSize;

    const items = this.db
      .prepare(
        `SELECT * FROM tasks
         WHERE ${whereClause}
         ORDER BY ${sortColumn} ${sortDir}, id ASC
         LIMIT @limit OFFSET @offset`,
      )
      .all({ ...params, limit: filter.pageSize, offset }) as TaskRow[];

    return { items, totalItems };
  }
}
