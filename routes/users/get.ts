import { Request, Response } from 'express'
import { prisma } from '../../database'

export const apiDefinition = {
  alias: 'createStaff',
  description: 'Create staff',
  parameters: [

  ],
  response: [],
  errorStatuses: [400, 403]
}

export default async (req: Request, res: Response) => {
  const staffInfo = req.body

  await prisma.user.create({ data: staffInfo })

  return res.sendStatus(200)
}
