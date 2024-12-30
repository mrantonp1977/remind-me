
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { useForm } from 'react-hook-form';
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from '@/schemas/createCollection';
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
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { createCollection } from '@/actions/collections';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateCollectionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateCollectionSheet({
  open,
  onOpenChange,
}: CreateCollectionSheetProps) {
  const form = useForm<createCollectionSchemaType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      name: '',
      color: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      await createCollection(data);
      form.reset();
      openChangeWrapper(false);
      router.refresh();
      toast({
        title: "Success",
        description: "Collection created successfully.",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
      console.log(error);
    }
    
  };

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  }

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a new collection</SheetTitle>
          <SheetDescription>
            Collections are a way to organize your tasks.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 flex flex-col'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn(
                          `w-full h-8 rounded-md text-white`,
                          CollectionColors[field.value as CollectionColor]
                        )}
                      >
                        <SelectValue
                          placeholder="Select a color"
                          className="w-full h-8"
                        />
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.keys(CollectionColors).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={cn(
                              `w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-4`,
                              CollectionColors[color as CollectionColor]
                            )}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a color for the collection.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex flex-col gap-3 mt-4">
          <Separator />
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className={cn(form.watch("color") && CollectionColors[form.getValues().color as CollectionColor])}
            variant={"outline"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Please wait..." : "Confirm"}
            {form.formState.isSubmitting && <Loader className="ml-2 size-4 animate-spin" />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCollectionSheet;
