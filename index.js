import Connection from 'aquameta-connection'
import { datum, endpoint } from 'aquameta-datum'

export default function (config) {
  if (config.external) {
    return externalMiddleware(config)
  }
  return localMiddleware(config)
}

function externalMiddleware (config) {
  // TODO: need to pass session cookie into this request in order to forward permissions
  const sessionCookie = req

  return function (req, res, next) {
    req.datum = {
      schema (name) {
        return datum(config).schema(name)
      }
    }
    next()
  }
}

function localMiddleware (config) {
  // TODO: need to find if there is a connection override in the config
  let connection

  if (config.connection) {
    // Not using Postgres role authentication
    connection = Connection(config)
  } else {
    // Postgres role received in HTTP request
    connection = Connection(config, request)
  }

  return function (req, res, next) {
    req.connect = connection.connect
    req.datum = {
      schema (name) {
        return datum(connection, name)
      }
    }
    next()
  }
}
