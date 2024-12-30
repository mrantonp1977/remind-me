'use client';

import { Task } from '@prisma/client';
import React, { useTransition } from 'react';
import { Checkbox } from './ui/checkbox';
import { cn } from '@/lib/utils';
import { setTaskToDone } from '@/actions/task';
import { useRouter } from 'next/navigation';

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;
  if (days < 0) return 'text-gray-500 dark:text-gray-400';
  if (days <= 3 * 24) return 'text-red-500 dark:text-red-400';
  if (days <= 7 * 24) return 'text-violet-500 dark:text-violet-400';
  return 'text-green-500 dark:text-green-400';
}

function TaskCard({ task }: { task: Task }) {
  const [isLoading, startTransition] = useTransition();
  const router = useRouter();
  return (
    <div className="flex items-start gap-4 ml-2 pt-4 pb-4">
      <Checkbox
        className="size-4"
        checked={task.done}
        disabled={task.done || isLoading}
        id={task.id.toString()}
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskToDone(task.id);
            router.refresh();
          });
        }}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white',
          task.done && 'line-through'
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              'text-xs text-neutral-500',
              getExpirationColor(task.expiresAt)
            )}
          >
            Expires at: {new Date(task.expiresAt).toLocaleDateString()}
          </p>
        )}
      </label>
    </div>
  );
}

export default TaskCard;
