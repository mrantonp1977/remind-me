'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import CreateCollectionSheet from './CreateCollectionSheet';

function CreateCollectionButton() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => setOpen(open);
  return (
    <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-600 p-[2px]">
      <Button
        variant={'outline'}
        className="dark:text-white w-full dark:bg-neutral-950 bg-white"
        onClick={() => setOpen(true)}
      >
        <span className="font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:to-orange-800 text-transparent bg-clip-text">
          Create Collection
        </span>
      </Button>
      <CreateCollectionSheet open={open} onOpenChange={handleOpenChange}/>
    </div>
  );
}

export default CreateCollectionButton;
