import { Request, Response } from 'servie'

export interface Options {
  origin?: boolean | string
  expose?: string | string[] | false
  methods?: string | string[] | false
  headers?: string | string[] | false
  maxAge?: number
  credentials?: boolean
  optionsContinue?: boolean
  optionsSuccessStatus?: number
}

export type OptionsFunction = (req: Request) => Options | Promise<Options>

/**
 * Process requests as CORS.
 */
export function cors (options: Options | OptionsFunction = {}) {
  const getOptions = typeof options === 'function' ? options : () => options

  return async function (req: Request, next: () => Promise<Response>): Promise<Response> {
    const options = await getOptions(req)
    let res: Response

    if (options.origin === false) {
      if (req.method === 'OPTIONS' && !options.optionsContinue) {
        return new Response({ status: options.optionsSuccessStatus || 204 })
      }

      return next()
    }

    if (req.method === 'OPTIONS') {
      if (options.optionsContinue) {
        res = await next()
      } else {
        res = new Response({ status: options.optionsSuccessStatus || 204 })
      }

      const methods = stringify(options.methods) || (options.methods === false ? false : 'GET,HEAD,PUT,PATCH,POST,DELETE')
      const headers = stringify(options.headers) || (options.headers === false ? false : req.headers.get('Access-Control-Request-Headers'))

      if (methods) {
        res.headers.set('Access-Control-Allow-Methods', methods)
      }

      if (headers) {
        res.headers.set('Access-Control-Allow-Headers', headers)
      }

      if (typeof options.maxAge === 'number') {
        res.headers.set('Access-Control-Max-Age', options.maxAge)
      }
    } else {
      res = await next()
    }

    const origin = typeof options.origin === 'string' ? options.origin : (req.headers.get('Origin') || '*')
    const expose = stringify(options.expose)

    res.headers.set('Access-Control-Allow-Origin', origin)

    if (expose) {
      res.headers.set('Access-Control-Expose-Headers', expose)
    }

    if (options.credentials) {
      res.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    if (origin !== '*' && origin === req.headers.get('Origin')) {
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
