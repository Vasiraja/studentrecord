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
    const cookieHeader = req.headers?.cookie;

    if (!cookieHeader) return null;

    const match = cookieHeader.match(/feathers-jwt=([^;]+)/);
    const token = match ? match[1] : null;

    // console.log('TOKEN:', token);

    if (token) {
      return {
        strategy: 'jwt',
        accessToken: token 
      };
    }

    return null;
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new CookieJWTStrategy())
  authentication.register('local', new LocalStrategy())

  app.use('authentication', authentication)

  app.service('authentication').hooks(hooks)
}