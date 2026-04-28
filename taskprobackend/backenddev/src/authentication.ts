import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'

import hooks from '../src/hooks/cookie-set'
import type { Application } from './declarations'

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

class CookieJWTStrategy extends JWTStrategy {
  async parse(req: any) {
    const token = req.cookies?.['feathers-jwt']

    if (token) {
      return {
        strategy: 'jwt',
        accessToken: token
      }
    }

    return null
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new CookieJWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)

  app.service('authentication').hooks(hooks)
}