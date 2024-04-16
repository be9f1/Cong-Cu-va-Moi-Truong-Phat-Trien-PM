import { FilterQuery } from 'mongoose';

export class CommonService<T> {
  constructor(private primaryModel: Record<any, any>) {}

  async delete(id: string) {
    await this.primaryModel.findByIdAndDelete(id);
    return true;
  }

  async findOne(data: FilterQuery<T>) {
    return this.primaryModel.findOne(data) as T;
  }

  async findById(id: string) {
    return this.primaryModel.findById(id) as T;
  }

  async findByIds(ids: string[]) {
    return this.primaryModel.find({ _id: { $in: ids } }) as T[];
  }

  async findAll() {
    return this.primaryModel.find({}) as T[];
  }

  async find(
    options?: Record<any, any>,
    protection?: Record<any, any>,
    paramse?: Record<any, any>,
    sort?: Record<any, any>
  ) {
    if (sort)
      return this.primaryModel
        .find(options, protection ?? null, paramse ?? {})
        .sort(sort) as T[];
    return this.primaryModel.find(
      options,
      protection ?? null,
      paramse ?? {}
    ) as T[];
  }

  async filterGroup(data: {
    match: Record<any, any>;
    page: number;
    limit: number;
    fieldName: string;
  }) {
    const { match, limit, page, fieldName } = data;
    const baseFilter: any = [
      {
        $match: match
      }
    ];
    const aggregateObject: any = baseFilter.concat([
      { $group: { _id: `$${fieldName}` } },
      { $sort: { [fieldName]: 1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);
    const aggregateObjectCount = baseFilter.concat([
      {
        $group: {
          _id: `$${fieldName}`,
          total: { $sum: 1 }
        }
      }
    ]);
    const [items, total] = await Promise.all([
      this.primaryModel.aggregate(aggregateObject),
      this.primaryModel.aggregate(aggregateObjectCount)
    ]);
    return {
      items: items.map((item) => {
        return {
          id: item._id
        };
      }),
      total: total.length
    };
  }
}
