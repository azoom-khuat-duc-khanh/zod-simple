import { Request, Response } from 'express'
import { prisma } from '../../database'
import { UserSchema } from '../../lib/schemas'

export const apiDefinition = {
  alias: 'createStaff1',
  description: 'Create staff',
  parameters: [
    {
      name: 'User',
      type: 'Body',
      description: `User create`,
      schema: UserSchema.omit({
        id: true
      })
    }
  ],
  response: [],
  errorStatuses: [400, 403]
}

export default async (req: Request, res: Response) => {
  const user  = req.body
  console.log(24, user);
  return res.status(201).send("ok")
  await prisma.user.create({ data: user })

  return res.status(201)
}
