// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const bulkEdit = async (context: HookContext) => {

  const { data, app } = context;

  if (!data.students) return context;

  if (!Array.isArray(data.students)) {
    throw new Error("Invalid bulk params")
  }

  const service = app.service("students");

  const updated = await Promise.all( 
    data.students.map((student: any) => {
      const { _id, profilePhoto, ...updateData } = student;
      if (!_id) return null;
      return service.patch(_id, updateData)
    })
  )

  context.result = updated.filter(Boolean);
  return context;


}
