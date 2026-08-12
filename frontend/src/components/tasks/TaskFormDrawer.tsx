import { useEffect, useState, type FormEvent } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TASK_PRIORITIES, TASK_STATUSES, type Task, type TaskPriority, type TaskStatus } from '@/types/task';
import { ApiError } from '@/types/api';
import { toDateInputValue, toIsoDueDate } from '@/utils/date';

export interface TaskFormValues {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: TaskPriority;
  status?: TaskStatus;
}

interface TaskFormDrawerProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
}


export function TaskFormDrawer({ isOpen, task, onClose, onSubmit, onDelete }: TaskFormDrawerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [dueDateError, setDueDateError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setDueDate(toDateInputValue(task?.dueDate ?? null));
    setPriority(task?.priority ?? 'Medium');
    setStatus(task?.status ?? 'Pending');
    setTitleError(null);
    setDueDateError(null);
    setFormError(null);
  }, [isOpen, task]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required.');
      return;
    }
    setTitleError(null);

    const nextDueDate = toIsoDueDate(dueDate);
    const dueDateChanged = nextDueDate !== (task?.dueDate ?? null);
    if (dueDateChanged && nextDueDate && new Date(nextDueDate).getTime() < Date.now()) {
      setDueDateError('Due date cannot be in the past.');
      return;
    }
    setDueDateError(null);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() ? description.trim() : null,
        dueDate: nextDueDate,
        priority,
        status: task ? status : undefined,
      });
      onClose();
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Unable to save this task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete();
      setIsConfirmingDelete(false);
      onClose();
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : 'Unable to delete this task. Please try again.');
      setIsConfirmingDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Drawer isOpen={isOpen} onClose={onClose} title={task ? 'Edit task' : 'New task'}>
        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col gap-4">
          {formError && <Alert>{formError}</Alert>}

          <Input
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            error={titleError ?? undefined}
            required
            maxLength={255}
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={4000}
          />

          <div className="grid grid-cols-2 gap-3">
            {task && (
              <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
                {TASK_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            )}
            <Select
              label="Priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
            >
              {TASK_PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            error={dueDateError ?? undefined}
          />

          <div className="mt-auto flex items-center gap-2 pt-6">
            <Button type="submit" isLoading={isSubmitting} className="flex-1">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {task && onDelete && (
              <Button
                type="button"
                variant="ghost"
                aria-label="Delete task"
                onClick={() => setIsConfirmingDelete(true)}
              >
                🗑
              </Button>
            )}
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={isConfirmingDelete}
        title="Delete this task?"
        description="This action can't be undone."
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmingDelete(false)}
      />
    </>
  );
}
