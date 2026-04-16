// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { User, UserData, UserPatch, UserQuery } from './users.schema'
import { BadRequest } from '@feathersjs/errors'

export type { User, UserData, UserPatch, UserQuery }

export interface UserParams extends MongoDBAdapterParams<UserQuery> { }
export async function checkDuplicateMail(context: any) {

  const checkEmailExists = await context.service.find({
    query: { email: context.data.email, $limit: 1 }
  })

  if (checkEmailExists.total > 0) {
    throw new BadRequest("Email already exists")
  }
  return context;

}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class UserService<ServiceParams extends Params = UserParams> extends MongoDBService<
  User,
  UserData,
  UserParams,
  UserPatch
> {

  // async get(id: any, data: any): Promise<any> {


  //   return super.get(id, data);
  // }

}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('users'))
  }
}
