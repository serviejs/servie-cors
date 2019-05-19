import { compose } from "throwback";
import { cors } from "./index";
import { Request, Response } from "servie/dist/node";
import { finalhandler } from "servie-finalhandler";

describe("servie-cors", () => {
  it("should set origin", () => {
    const app = compose<Request, Response>([
      cors(),
      req => new Response(req.method, { status: 200 })
    ]);

    const req = new Request("/");

    return app(req, finalhandler(req)).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  it("should handle options", () => {
    const app = cors();

    const req = new Request("/", { method: "options" });

    return app(req, finalhandler(req)).then(res => {
      expect(res).toMatchSnapshot();
    });
  });

  it("should forward options", () => {
    const app = compose<Request, Response>([
      cors({ optionsContinue: true }),
      function(req) {
        return new Response(req.method, { status: 200 });
      }
    ]);

    const req = new Request("/", { method: "options" });

    return app(req, finalhandler(req)).then(res => {
      expect(res).toMatchSnapshot();
    });
  });
});
