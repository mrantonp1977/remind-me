'use client';

import { Collection, Task } from '@prisma/client';
import React, { useMemo, useState, useTransition } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { ChevronDown, PlusIcon, Trash } from 'lucide-react';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { deleteCollection } from '@/actions/collections';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import CreateTaskDialog from './CreateTaskDialog';
import TaskCard from './TaskCard';

interface CollectionCardProps {
  collection: Collection & {
    tasks: Task[];
  };
}

function CollectionCard({ collection }: CollectionCardProps) {
  const [isOpen, seIsOpen] = useState(false);
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: 'Collection deleted',
        description: 'The collection was successfully deleted',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error deleting collection',
        description: 'Something went wrong while deleting the collection',
        variant: 'destructive',
      });
      console.log(error);
    }
  };

  const tasks = collection.tasks;

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const totalTasks = collection.tasks.length;

  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;
    

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={seIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={'ghost'}
            className={cn(
              'flex w-full justify-between p-6',
              isOpen && 'rounded-b-none',
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className="text-white font-bold">{collection.name}</span>
            {!isOpen && <ChevronDown className="size-6" />}
            {isOpen && <ChevronDown className="size-6 transform rotate-180" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {tasks.length === 0 && (
            <Button
              variant={'ghost'}
              className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
              onClick={() => setShowCreateModal(true)}
            >
              <p>
                There are no tasks in this collection.
              </p>
              <span className={cn("text-sm font-semibold bg-clip-text text-transparent", CollectionColors[collection.color as CollectionColor])}>
                Click here to add one.
              </span>
            </Button>
          )}
          {tasks.length > 0 && (
            <>
              <Progress className="rounded-none" value={progress} />
              <div>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs ttext-neutral-500 flex justify-between items-center">
            <p>
              Created: {new Date(collection.createdAt).toLocaleDateString()}
            </p>
            {isLoading && <p>Deleting...</p>}
            {!isLoading && (
              <div className="">
                <Button
                  variant={'ghost'}
                  className="p-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon className="size-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant={'ghost'} className="p-2">
                      <Trash className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-neutral-900 border-2 border-red-700">
                    <AlertDialogTitle>
                      Are you sure you want to delete this collection?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the collection and all its tasks.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}

export default CollectionCard;
