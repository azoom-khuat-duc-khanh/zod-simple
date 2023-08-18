import express, { Request, Response } from 'express'
import dotenv from 'dotenv';
import nnnRouter from '@azoom/nnn-router'
import { zodiosApp, zodiosRouter } from '@zodios/express'
import { generateApis } from "./util"
dotenv.config();

async function main() {
  const apis = await generateApis({ routeFolder: 'routes' })
  const expressApp = express()
  const app = zodiosApp(apis, { express: expressApp, transform: true })

  app.use(
    nnnRouter({
      routeDir: '/routes',
      baseRouter: zodiosRouter(apis, { transform: true })
    })
  )

  const port = 3009

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

main()

