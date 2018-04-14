import { compose } from 'throwback'
import { cors } from './index'
import { Request, Response } from 'servie'
import { createBody } from 'servie/dist/body/node'

describe('servie-cors', () => {
  it('should set origin', () => {
    const app = compose<Request, Response>([
      cors(),
      (req) => new Response({ statusCode: 200, body: createBody(req.method) })
    ])

    const req = new Request({ url: '/' })

    return app(req, finalhandler(req)).then((res) => {
      expect(res.toJSON()).toMatchSnapshot()
    })
  })

  it('should handle options', () => {
    const app = cors()

    const req = new Request({ url: '/', method: 'options' })

    return app(req, finalhandler(req)).then((res) => {
      expect(res.toJSON()).toMatchSnapshot()
    })
  })

  it('should forward options', () => {
    const app = compose<Request, Response>([
      cors({ optionsContinue: true }),
      function (req) {
        return new Response({ statusCode: 200, body: createBody(req.method) })
      }
    ])

    const req = new Request({ url: '/', method: 'options' })

    return app(req, finalhandler(req)).then((res) => {
      expect(res.toJSON()).toMatchSnapshot()
    })
  })
})

/**
 * Final 404 handler.
 */
function finalhandler (req: Request) {
  return function () {
    return Promise.resolve(new Response({
      statusCode: 404,
      body: createBody(`Cannot ${req.method} ${req.url}`)
    }))
  }
}
