// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { StudentsService } from './students.class'

// Main data model schema
export const studentsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    studentname: Type.String(),
    dob: Type.String(),
    age: Type.Optional(Type.String()),
    class: Type.String(),
    gender: Type.String(),

  },
  { $id: 'Students', additionalProperties: false }
)
export type Students = Static<typeof studentsSchema>
export const studentsValidator = getValidator(studentsSchema, dataValidator)
export const studentsResolver = resolve<StudentsQuery, HookContext<StudentsService>>({})

export const studentsExternalResolver = resolve<Students, HookContext<StudentsService>>({})

// Schema for creating new entries
export const studentsDataSchema = Type.Pick(studentsSchema, ['studentname', 'dob', 'age', 'class', 'gender'], {
  $id: 'StudentsData'
})
export type StudentsData = Static<typeof studentsDataSchema>
export const studentsDataValidator = getValidator(studentsDataSchema, dataValidator)
export const studentsDataResolver = resolve<StudentsData, HookContext<StudentsService>>({

  age: async (curr: any, data: any, context: any) => {
    const newDate = new Date();
    const birthDate = new Date(data?.dob);
    const birthyear = birthDate.getFullYear();
    const currentYear = newDate.getFullYear();
    let ageCalc = currentYear - birthyear;

    const birthMonth = birthDate.getMonth() + 1
    const currentMonth = newDate.getMonth() + 1;
    if (birthMonth > currentMonth) {
      ageCalc = ageCalc - 1;

    }
    else if (birthMonth === currentMonth) {
      console.log(birthDate.getDate())
      if (birthDate.getDate() > newDate.getDate()) {
         ageCalc = ageCalc - 1


      }
    }
    curr = ageCalc;
    return curr;

  }

})

// Schema for updating existing entries
export const studentsPatchSchema = Type.Partial(studentsSchema, {
  $id: 'StudentsPatch'
})
export type StudentsPatch = Static<typeof studentsPatchSchema>
export const studentsPatchValidator = getValidator(studentsPatchSchema, dataValidator)
export const studentsPatchResolver = resolve<StudentsPatch, HookContext<StudentsService>>({})

// Schema for allowed query properties
export const studentsQueryProperties = Type.Pick(studentsSchema, ['_id'])
export const studentsQuerySchema = Type.Intersect(
  [
    querySyntax(studentsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type StudentsQuery = Static<typeof studentsQuerySchema>
export const studentsQueryValidator = getValidator(studentsQuerySchema, queryValidator)
export const studentsQueryResolver = resolve<StudentsQuery, HookContext<StudentsService>>({})
