// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext, NextFunction } from '../declarations'

export const pidGenerate = async (context: HookContext) => {
  const products = context.app.service('products');

  const yearShort = String(new Date().getFullYear()).slice(2,4);

  const result = await products.find({
    query: {  
      productId: {
        $regex: `^PID${yearShort}` 
      },
      $sort: {
        productId: -1
      },
      $limit: 1
    }
  });

  let nextNumber = 1;

  if ((result as any).data.length > 0) {
    const lastId = (result as any).data[0].productId;
    const lastNum = parseInt(lastId.slice(-3));
    nextNumber = lastNum + 1;
  }

  const padded = String(nextNumber).padStart(3, '0');

  context.data.productId = `PID${yearShort}${padded}`;

  return context;
}
