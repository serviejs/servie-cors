import { Request, Response } from "servie/dist/node";

export interface Options {
  origin?: string | false;
  expose?: string | string[] | false;
  methods?: string | string[] | false;
  headers?: string | string[] | false;
  maxAge?: number;
  credentials?: boolean;
  optionsContinue?: boolean;
  optionsStatus?: number;
}

export type OptionsFunction = (req: Request) => Options | Promise<Options>;

const DEFAULT_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

/**
 * Process requests as CORS.
 */
export function cors(options: Options | OptionsFunction = {}) {
  const getOptions = typeof options === "function" ? options : () => options;

  return async function(
    req: Request,
    next: () => Promise<Response>
  ): Promise<Response> {
    const options = await getOptions(req);
    let res: Response;

    if (options.origin === false) {
      if (req.method.toLowerCase() !== "options") return next();
      if (options.optionsContinue) return next();

      return new Response(null, { status: options.optionsStatus || 204 });
    }

    if (req.method.toLowerCase() === "options") {
      if (options.optionsContinue) {
        res = await next();
      } else {
        res = new Response(null, { status: options.optionsStatus || 204 });
      }

      const allowMethodsHeader =
        options.methods === false
          ? ""
          : stringify(options.methods) || DEFAULT_METHODS;
      const allowHeadersHeader =
        options.headers === false
          ? ""
          : stringify(options.headers) ||
            req.headers.get("Access-Control-Request-Headers");

      if (allowMethodsHeader) {
        res.headers.set("Access-Control-Allow-Methods", allowMethodsHeader);
      }

      if (allowHeadersHeader) {
        res.headers.set("Access-Control-Allow-Headers", allowHeadersHeader);
      }

      if (typeof options.maxAge === "number") {
        res.headers.set("Access-Control-Max-Age", String(options.maxAge));
      }
    } else {
      res = await next();
    }

    const allowOrigin = options.origin || "*";
    const exposeHeader =
      options.expose === false ? "" : stringify(options.expose);

    res.headers.set("Access-Control-Allow-Origin", allowOrigin);

    if (exposeHeader) {
      res.headers.set("Access-Control-Expose-Headers", exposeHeader);
    }

    if (options.credentials) {
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }

    if (allowOrigin !== "*") {
      res.headers.set(
        "Vary",
        res.headers
          .getAll("Vary")
          .concat("Origin")
          .join(",")
      );
    }

    return res;
  };
}

/**
 * Input value to a string.
 */
function stringify<T>(value: undefined | string | string[]): string {
  return Array.isArray(value) ? value.join(",") : value || "";
}
