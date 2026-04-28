// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext, NextFunction } from '../declarations'

export const cookieSet = async (context: HookContext) => {

  const { accessToken } = context.result;

  const res = context.params.res;

  if (res && accessToken) {
    res.cookie('feathers-jwt', accessToken, {
      httpOnly: true,
      secure: false,
      samesite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000



    })
    delete context.result.accessToken;
  }
  return context;


}

export default {
  after: {
    create: [cookieSet]
  }
}
