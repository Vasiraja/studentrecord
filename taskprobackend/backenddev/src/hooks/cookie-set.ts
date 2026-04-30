// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext, NextFunction } from '../declarations'
export const cookieSet = async (context: HookContext) => {
  console.log('HOOK RUNNING');

  const { accessToken } = context.result;

  if (accessToken) {
    context.http = context.http || {};

    context.http.headers = {
      ...(context.http.headers || {}),
      'Set-Cookie': `feathers-jwt=${accessToken}; HttpOnly; Path=/;  SameSite=Lax`
    };

    delete context.result.accessToken;
  }

  return context;
};

export default {
  after: {
    create: [cookieSet]
  }
}
