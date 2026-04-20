import type { HookContext } from '@feathersjs/feathers';

export const idGenerate = async (context: HookContext)=> {
  const students = context.app.service('students');

  const yearShort = String(new Date().getFullYear()).slice(-2);

  const result = await students.find({
    query: {
      studentId: {
        $regex: `^ST${yearShort}`
      },
      $sort: {
        studentId: -1
      },
      $limit: 1
    }
  });

  let nextNumber = 1;

  if ((result as any).data.length > 0) {
    const lastId = (result as any).data[0].studentId;
    const lastNum = parseInt(lastId.slice(-3));
    nextNumber = lastNum + 1;
  }

  const padded = String(nextNumber).padStart(3, '0');

  context.data.studentId = `ST${yearShort}${padded}`;

  return context;
};