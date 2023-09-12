import express from 'express'
import dotenv from 'dotenv';
import nnnRouter from '@azoom/nnn-router'
import { zodiosApp, zodiosRouter } from '@zodios/express'
import { generateApis } from "./util"
dotenv.config();

const routeDir = process.env.NODE_ENV === 'development' ? 'routes' : 'dist/routes'
async function main() {
  const apis = await generateApis({ routeFolder: routeDir})
  const expressApp = express()
  const app = zodiosApp(apis, { express: expressApp, transform: true })
  
  app.use(
    nnnRouter({
      routeDir: `/${routeDir}`,
      baseRouter: zodiosRouter(apis, { transform: true })
    })
  )

  const port = 3009

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

main()

