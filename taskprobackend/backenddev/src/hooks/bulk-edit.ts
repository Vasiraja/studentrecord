import type { HookContext } from '../declarations'

export const bulkEdit = async (context: HookContext) => {

  const { data, app } = context;

  if (data.students) {

    if (!Array.isArray(data.students)) {
      throw new Error("Invalid students data");
    }

    const service = app.service("students");

    const updated = await Promise.all(
      data.students.map((student: any) => {
        const { _id, profilePhoto, ...updateData } = student;
        if (!_id) return null;
        return service.patch(_id, updateData);
      })
    );

    context.result = updated.filter(Boolean);
    return context;
  }

  if (data.products) {
    if (!Array.isArray(data.products)) {
      throw new Error("Invalid products data");
    }

    const service = app.service("products");

    const updated = await Promise.all(
      data.products.map(async (product: any) => {
        const { _id, profilePhoto, ...updateData } = product;

        if (!_id) return null;

        await service.patch(_id, updateData);

        return service.get(_id);
      })
    );

    context.result = updated.filter(Boolean);
    return context;
  }

  return context;
};