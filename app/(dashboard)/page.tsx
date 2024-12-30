import CollectionCard from '@/components/CollectionCard';
import CreateCollectionButton from '@/components/CreateCollectionButton';
import SadFace from '@/components/icons/SadFace';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/db';
import { wait } from '@/lib/wait';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();
  await wait(2000);
  if (!user) {
    redirect('/sign-in');
  }
  return (
    <div className="flex w-full">
      <h1 className="text-4xl font-bold mb-12">
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="flex w-full">
      <h1 className="text-4xl font-bold mb-12">
        <Skeleton className="w-[150px] h-[36px]" />
        <Skeleton className="w-[150px] h-[36px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });
  if (collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet!</AlertTitle>
          <AlertDescription>
            Start by creating a new collection.
          </AlertDescription>
        </Alert>
        <CreateCollectionButton />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionButton />
      <div className="flex flex-col gap-5 mt-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
