"use server"

import prisma from "@/lib/db";
import { createTaskSchemaType } from "@/schemas/createTask";
import { currentUser } from "@clerk/nextjs/server";

export async function createTask(data: createTaskSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.task.create({
    data: {
      userId: user.id,
      content: data.content,
      expiresAt: data.expiresAt,
      Collection: {
          connect: {
            id: data.collectionId,
          }
        }
    }
  })
}

// export async function deleteCollection(id: number) {
//   const user = await currentUser();

//   if (!user) {
//     throw new Error('User not found');
//   }

//   return await prisma.collection.delete({
//     where: {
//       id,
//       userId: user.id,
//     }
//   })
// }

export async function setTaskToDone(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  return await prisma.task.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      done: true,
    }
  })
}