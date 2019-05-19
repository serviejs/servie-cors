# Servie CORS

[![NPM version](https://img.shields.io/npm/v/servie-cors.svg?style=flat)](https://npmjs.org/package/servie-cors)
[![NPM downloads](https://img.shields.io/npm/dm/servie-cors.svg?style=flat)](https://npmjs.org/package/servie-cors)
[![Build status](https://img.shields.io/travis/serviejs/servie-cors.svg?style=flat)](https://travis-ci.org/serviejs/servie-cors)
[![Test coverage](https://img.shields.io/coveralls/serviejs/servie-cors.svg?style=flat)](https://coveralls.io/r/serviejs/servie-cors?branch=master)

> CORS middleware for Servie.

## Installation

```
npm install servie-cors --save
```

## Usage

```ts
import { cors } from "servie-cors";
import { compose } from "throwback";
import { get } from "servie-route";

const app = compose([cors(), get("/foo", () => new Response(null))]);
```

### Options

- `origin?: boolean | string` - Configures the **Access-Control-Allow-Origin** CORS header.
- `expose?: string | string[] | false` - Configures the **Access-Control-Expose-Headers** CORS header.
- `methods?: string | string[] | false` - Configures the **Access-Control-Allow-Methods** CORS header.
- `headers?: string | string[] | false` - Configures the **Access-Control-Allow-Headers** CORS header.
- `maxAge?: number` - Configures the **Access-Control-Max-Age** CORS header.
- `credentials?: boolean` - Configures the **Access-Control-Allow-Credentials** CORS header.
- `optionsContinue?: boolean` - Pass the CORS preflight **OPTIONS** request to the `next()` handler.
- `optionsStatus?: number` - Provides a status code to use for successful OPTIONS requests.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0
