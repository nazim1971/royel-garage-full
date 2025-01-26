import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  private modelQuery: Query<T[], T>;
  private query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search = this.query?.search as string | undefined;
    if (search) {
      const regexQuery = searchableFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
      this.modelQuery = this.modelQuery.find({
        $or: regexQuery as FilterQuery<T>[],
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Exclude non-filter fields directly using a set
    const excludeFields = new Set([
      'search',
      'sortBy',
      'sortOrder',
      'filter',
      'limit',
      'page',
      'fields',
    ]);
    for (const key of Object.keys(queryObj)) {
      if (excludeFields.has(key)) {
        delete queryObj[key];
      }
    }
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
  authorFilter() {
    
    const id = (this.query?.filter as string);
    if (id) { 
      this.modelQuery = this.modelQuery.find({ author: id });
    }
    return this;
  }
  sort() {
    const sortBy = (this.query?.sortBy as string) || 'createdAt';
    const sortOrder = (this.query?.sortOrder as string) || 'desc';

    // Add sorting to the query
    const sortQuery: { [key: string]: 1 | -1 } = {};
    sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;
    this.modelQuery = this.modelQuery.sort(sortQuery);
    return this;
  }

  getQuery() {
    return this.modelQuery;
  }
}

export default QueryBuilder;