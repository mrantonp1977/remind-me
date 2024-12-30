'use client';

import { Collection } from '@prisma/client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { createTaskSchema, createTaskSchemaType } from '@/schemas/createTask';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Calendar1Icon, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { createTask } from '@/actions/task';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CreateTaskDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  collection: Collection;
}

function CreateTaskDialog({
  open,
  setOpen,
  collection,
}: CreateTaskDialogProps) {
  const router = useRouter();
  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id,
    },
  });
  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };

  const onSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data);
      toast({
        title: 'Success',
        description: 'The task has been created successfully.',
      });
      openChangeWrapper(false);
      router.refresh();

    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: "Couldn't create the task. Please try again later.",
        variant: 'destructive',
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeWrapper}>
      <DialogContent className="sm:max-w-[425px] border-2 border-orange-500">
        <DialogHeader>
          <DialogTitle className="flex gap-2">
            Add a task to collection:{' '}
            <span
              className={cn(
                'px-3 bg-clip-text text-transparent',
                CollectionColors[collection.color as CollectionColor]
              )}
            >
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a task to this collection. You can always edit or delete it
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4 p-4">
          <Form {...form}>
            <form
              className="space-y-4 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Text content here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires At</FormLabel>
                    <FormDescription>
                      When should this task expire?
                    </FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'justify-start text-left font-normal w-full',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <Calendar1Icon className="size-4 mr-2" />
                            {field.value && format(field.value, 'PPP')}
                            {!field.value && 'Select a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className={cn(
              'w-full dark:text-white',
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            {form.formState.isSubmitting ? (
              <>
                Please wait...
                <Loader className="size-4 ml-2 animate-spin" />
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTaskDialog;
