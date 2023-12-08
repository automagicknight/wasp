import prisma from 'wasp/server/dbClient.js'
import { getTasks as getTasksUser } from 'wasp/ext-src/queries.js'

export type GetTasks = typeof getTasksUser

export const getTasks = async (args, context) => {
  return (getTasksUser as any)(args, {
    ...context,
    entities: {
      Task: prisma.task,
    },
  })
}
