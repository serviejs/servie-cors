# Servie CORS

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/blakeembrey/node-servie-cors.svg)](https://greenkeeper.io/)

> CORS middleware for Servie.

## Installation

```
npm install servie-cors --save
```

## Usage

```ts
import { cors } from 'servie-cors'
import { compose } from 'throwback'
import { get } from 'servie-route'

const app = compose(
  cors(),
  get('/foo', ...)
)
```

### Options

* `origin?: boolean | string` - Configures the **Access-Control-Allow-Origin** CORS header.
* `expose?: string | string[] | false` - Configures the **Access-Control-Expose-Headers** CORS header.
* `methods?: string | string[] | false` - Configures the **Access-Control-Allow-Methods** CORS header.
* `headers?: string | string[] | false` - Configures the **Access-Control-Allow-Headers** CORS header.
* `maxAge?: number` - Configures the **Access-Control-Max-Age** CORS header.
* `credentials?: boolean` - Configures the **Access-Control-Allow-Credentials** CORS header.
* `optionsContinue?: boolean` - Pass the CORS preflight **OPTIONS** request to the `next()` handler.
* `optionsSuccessStatus?: number` - Provides a status code to use for successful OPTIONS requests.

## TypeScript

This project is written using [TypeScript](https://github.com/Microsoft/TypeScript) and publishes the definitions directly to NPM.

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/servie-cors.svg?style=flat
[npm-url]: https://npmjs.org/package/servie-cors
[downloads-image]: https://img.shields.io/npm/dm/servie-cors.svg?style=flat
[downloads-url]: https://npmjs.org/package/servie-cors
[travis-image]: https://img.shields.io/travis/blakeembrey/node-servie-cors.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/node-servie-cors
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/node-servie-cors.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/node-servie-cors?branch=master
