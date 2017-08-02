import connect from 'aquameta-connection'
import datum from 'aquameta-datum'
import endpoint from 'aquameta-endpoint'

export default function (config) {
  if (config.external) {
    return externalMiddleware
  }
  return localMiddleware
}

function externalMiddleware (config) {
  return function (req, res, next) {
    req.datum = {
      schema (name) {
        return datum(Endpoint(config, req), name)
      }
    }
    next()
  }
}

function localMiddleware (config) {
  return function (req, res, next) {
    req.datum = {
      schema (name) {
        return datum(Connection(config, req), name)
      }
    }
    next()
  }
}
