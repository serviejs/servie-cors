import { compose } from 'throwback'
import { cors } from './index'
import { Request, Response } from 'servie'

describe('servie-cors', () => {
  it('should set origin', () => {
    const app = compose<Request, Response>([
      cors(),
      (req) => new Response({ status: 200, body: req.method })
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
        return new Response({ status: 200, body: req.method })
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
      status: 404,
      body: `Cannot ${req.method} ${req.url}`
    }))
  }
}
