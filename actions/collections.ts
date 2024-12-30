"use server"

import prisma from "@/lib/db";
import { createCollectionSchemaType } from "@/schemas/createCollection";
import { currentUser } from "@clerk/nextjs/server";

export async function createCollection(form: createCollectionSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.collection.create({
    data: {
      name: form.name,
      color: form.color,
      userId: user.id,
    }
  })
}

export async function deleteCollection(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.collection.delete({
    where: {
      id,
      userId: user.id,
    }
  })
}