// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Products, ProductsData, ProductsPatch, ProductsQuery } from './products.schema'

export type { Products, ProductsData, ProductsPatch, ProductsQuery }

export interface ProductsParams extends MongoDBAdapterParams<ProductsQuery> { }

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class ProductsService<ServiceParams extends Params = ProductsParams> extends MongoDBService<
  Products,
  ProductsData,
  ProductsParams,
  ProductsPatch
> {


  async create(data: any, params?: any): Promise<any> {

    const isBulk = params?.query?.bulk === 'true';

    if (isBulk) {
      console.log("Bulk here");
    }

    if (Array.isArray(data)) {
      console.log("Bulk array hhh");
      return super.create(data, params);
    }

    return super.create(data, params);
  }

}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('products')),
    multi: true
  }
}
