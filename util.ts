import { resolve, basename, extname } from 'node:path'
import { globSync } from 'glob'
import { z } from 'zod'
import { makeApi, Method, ZodiosEndpointDefinition, ZodiosEndpointError } from '@zodios/core'

export const userApi = makeApi([
  {
    method: "get",
    path: "/users", 
    alias: "getUser",
    description: "Get a user",
    response: z.object({
      id: z.number(),
      name: z.string(),
    }).array(),
  },
]);

export interface GenerateApisOptions {
  routeFolder?: string
}

export async function generateApis(options: GenerateApisOptions = {}) {
  const { routeFolder = 'routes'} = options
  const apiDefinitionConfigs = await prepareApiDefinitionConfig({ routeFolder })

  return makeApi(
    apiDefinitionConfigs.map(config => ({
      response: z.object({}).optional(),
      ...config.apiDefinition,
      method: config.apiMethod,
      path: config.apiPath,
      errors: (config.apiDefinition?.errorStatuses || []).map(
        status => ResponseSchemas[status]
      )
    }))
  )
}

interface ApiDefinition extends ZodiosEndpointDefinition {
  errorStatuses?: Array<number>
}

interface ApiDefinitionConfig {
  path: string
  fullFilePath: string
  apiPath: string
  apiMethod: Method
  apiDefinition?: ApiDefinition
}

function prepareApiDefinitionConfig({ routeFolder }: { routeFolder: string }): Promise<ApiDefinitionConfig[]> {
  const filePattern = '**/@(*.js|*.ts)'
  const formattedRouteFolder = resolve(process.cwd(), routeFolder)

  return Promise.all(
    globSync(filePattern, { cwd: formattedRouteFolder })
      .filter(path =>
        ['head', 'options', 'get', 'post', 'put', 'patch', 'delete'].includes(
          basename(path, extname(path)).toLowerCase()
        )
      )
      .map(async path => ({
        path,
        fullFilePath: `${formattedRouteFolder}/${path}`,
        apiPath: `/${path
          .replace(basename(path), '')
          .replace(/_/g, ':')
          .replace(/\/$/, '')
        }`,
        apiMethod: basename(path, extname(path)).toLowerCase() as Method,
        apiDefinition: (await import(`${formattedRouteFolder}/${path}`))?.apiDefinition || {}
      }))
  )
}

export const ResponseSchemas: { [key: number]: ZodiosEndpointError } = {
  200: {
    status: 200,
    schema: z.object({ message: z.string() })
  },
  201: {
    status: 201,
    schema: z.object({ message: z.string() })
  },
  202: {
    status: 202,
    schema: z.object({ message: z.string() })
  },
  204: {
    status: 204,
    schema: z.object({ message: z.string() })
  },
  400: {
    status: 400,
    schema: z.object({
      context: z.string(),
      error: z
        .object({
          code: z.string(),
          expected: z.string(),
          received: z.string(),
          path: z.string().array(),
          message: z.string()
        })
        .array()
    })
  },
  401: {
    status: 401,
    schema: z.object({ message: z.string() })
  },
  403: {
    status: 403,
    schema: z.object({ message: z.string() })
  },
  404: {
    status: 404,
    schema: z.object({ message: z.string() })
  },
  409: {
    status: 409,
    schema: z.object({ message: z.string() })
  },
  500: {
    status: 500,
    schema: z.object({ message: z.string() })
  },
  503: {
    status: 503,
    schema: z.object({ message: z.string() })
  }
}