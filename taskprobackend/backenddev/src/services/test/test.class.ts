// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Test, TestData, TestPatch, TestQuery } from './test.schema'

export type { Test, TestData, TestPatch, TestQuery }

export interface TestParams extends MongoDBAdapterParams<TestQuery> { }

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class TestService<ServiceParams extends Params = TestParams> extends MongoDBService<
  Test,
  TestData,
  TestParams,
  TestPatch
> {


  // async create(data: any, params: any): Promise<any> {

  //   if (params.user._id) {
  //     data.userId = params.user._id
  //   }



  //   return super.create(data, params)
  // }
  // async find(params: any): Promise<any> {

  //   if (params.query.$limit) {
  //     params.query.$limit = 10;
  //   }

  //   return super.find(params)
  // }
  // async get(id: any, params: any): Promise<any> {

  //   const loggedinUser = params.user._id;
  //   const userId = params.query.id;
  //   console.log(params.query)

  //   if (loggedinUser === userId) {
  //     console.log("sssss")
  //     return await super.get(id, params)

  //   }

  // }

  // async patch(id:any,data:any,params:any):Promise <any>{return await super.patch(id,data,params)}
  // async remove(id:any,params:any):Promise <any>{return await super.remove(id,params)}
}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('test'))
  }
}
