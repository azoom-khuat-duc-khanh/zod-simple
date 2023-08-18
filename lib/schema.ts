import { z } from 'zod'
import { ZodiosEndpointParameter } from '@zodios/core'
// @ts-ignore
import { DecimalJSLikeSchema } from './schemas'

export function validateEmail ({message}:{message?: string}) {
  return z.string().refine( v => {
    return /^([\w-.]+@([\w-]+\.)+[\w-]{2,})*$/.test(v)
  }, message)
}

export function validIntegerNumber({
  message,
  min = 0,
  minMessage
}: { message?: string; min?: number; minMessage?: string } = {}) {
  return z
    .number({ invalid_type_error: message })
    .min(min, { message: minMessage || message })
    .refine(
      v => {
        if (!`${v}`) return false
        return /^[0-9]+$/.test(`${v}`)
      },
      { message }
    )
}