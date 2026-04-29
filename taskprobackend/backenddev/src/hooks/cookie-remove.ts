// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext, NextFunction } from '../declarations'

export const cookieRemove = async (context: HookContext) => {
  context.http = context.http || {};
  context.http.headers = {
    ...(context.http.headers || {}),
    'Set-Cookie': `feathers-jwt=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  };
  return context;

}
 