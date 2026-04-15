// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params } from '@feathersjs/feathers'
import { MongoDBService } from '@feathersjs/mongodb'
import type { MongoDBAdapterParams, MongoDBAdapterOptions, NullableAdapterId } from '@feathersjs/mongodb'

import type { Application } from '../../declarations'
import type { Students, StudentsData, StudentsPatch, StudentsQuery } from './students.schema'
import { Context } from 'node:vm'
import { ObjectId } from 'mongodb'

export type { Students, StudentsData, StudentsPatch, StudentsQuery }

export interface StudentsParams extends MongoDBAdapterParams<StudentsQuery> { }

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class StudentsService<ServiceParams extends Params = StudentsParams> extends MongoDBService<
  Students,
  StudentsData,
  StudentsParams,
  StudentsPatch
> {




  async patch(id: any, data: any, params?: any): Promise<any> {



    if (data.delProfilePhoto) {
      await deletionProfilePhoto.call(this, id);
      delete data.delProfilePhoto;
    }

    console.log(id);
    console.log(data);
    console.log(params);



    return super.patch(id, data, params)

  }





}

export const getOptions = (app: Application): MongoDBAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then(db => db.collection('students'))
  }
}
async function deletionProfilePhoto(this: any, id: any) {
  const updated = await (await this.getModel()).updateOne(
    { _id: new ObjectId(id) },
    { $set: { profilePhoto: "" } }
  );

  console.log("Update result:", updated);

  if (updated?.modifiedCount > 0) {
    console.log("profile photo deleted");
  }
}

