import { Request, Response } from 'servie'

export interface Options {
  origin?: string | false
  expose?: string | string[] | false
  methods?: string | string[] | false
  headers?: string | string[] | false
  maxAge?: number
  credentials?: boolean
  optionsContinue?: boolean
  optionsStatusCode?: number
}

export type OptionsFunction = (req: Request) => Options | Promise<Options>

const DEFAULT_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'

/**
 * Process requests as CORS.
 */
export function cors (options: Options | OptionsFunction = {}) {
  const getOptions = typeof options === 'function' ? options : () => options

  return async function (req: Request, next: () => Promise<Response>): Promise<Response> {
    const options = await getOptions(req)
    let res: Response

    if (options.origin === false) {
      if (req.method.toLowerCase() !== 'options') return next()
      if (options.optionsContinue) return next()

      return new Response({ statusCode: options.optionsStatusCode || 204 })
    }

    if (req.method === 'OPTIONS') {
      if (options.optionsContinue) {
        res = await next()
      } else {
        res = new Response({ statusCode: options.optionsStatusCode || 204 })
      }

      const allowMethodsHeader = stringify(options.methods) || (!options.methods ? '' : DEFAULT_METHODS)
      const allowHeadersHeader = stringify(options.headers) || (!options.headers ? '' : req.headers.get('Access-Control-Request-Headers'))

      if (allowMethodsHeader) res.headers.set('Access-Control-Allow-Methods', allowMethodsHeader)
      if (allowHeadersHeader) res.headers.set('Access-Control-Allow-Headers', allowHeadersHeader)

      if (typeof options.maxAge === 'number') res.headers.set('Access-Control-Max-Age', options.maxAge)
    } else {
      res = await next()
    }

    const allowOrigin = options.origin || req.headers.get('Origin') || '*'
    const exposeHeader = stringify(options.expose)

    res.headers.set('Access-Control-Allow-Origin', allowOrigin)

    if (exposeHeader) res.headers.set('Access-Control-Expose-Headers', exposeHeader)
    if (options.credentials) res.headers.set('Access-Control-Allow-Credentials', 'true')

    if (allowOrigin !== '*') {
      res.headers.set('Vary', res.headers.getAll('Vary').concat('Origin').join(','))
    }

    return res
  }
}

/**
 * Input value to a string.
 */
function stringify <T> (value: T | string | string[]): T | string {
  return Array.isArray(value) ? value.join(',') : value
}
