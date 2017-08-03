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

  // TODO: need to pass session cookie into this request in order to forward permissions
  const sessionCookie = req

  return function (req, res, next) {
    req.datum = {
      schema (name) {
        return datum(Endpoint(config), name)
      }
    }
    next()
  }
}

function localMiddleware (config) {

  // TODO: need to find if there is a connection override in the config
  let connection

  /* Not using Postgres role authentication */
  if (config.connection) {
    connection = Connection(config)
  }

  /* Postgres role received in HTTP request */
  else {
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
