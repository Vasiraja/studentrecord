// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions, NullableAdapterId } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Students, StudentsData, StudentsPatch, StudentsQuery } from './students.schema'
 
export type { Students, StudentsData, StudentsPatch, StudentsQuery }

export interface StudentsParams extends MongoDBAdapterParams<StudentsQuery> { }

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class StudentsService<ServiceParams extends Params = StudentsParams> extends MongoDBService<
  Students,
  StudentsData,
  StudentsParams,
  StudentsPatch
> {

  




 






}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('students'))
  }
}
