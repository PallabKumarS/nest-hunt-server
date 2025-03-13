import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => {
          if (field === 'rentPrice' || field === 'bedroomNumber') {
            const numericValue = Number(searchTerm);
            if (!isNaN(numericValue))
              return {
                [field]: numericValue,
              };
            return { [field]: null };
          }
          return {
            [field]: { $regex: searchTerm, $options: 'i' },
          };
        }) as FilterQuery<T>[],
      });
    }

    return this;
  }

  // filter here for filtering
  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el) => delete queryObj[el]);

    if (typeof queryObj.houseLocation === 'string') {
      queryObj.houseLocation = {
        $in: queryObj.houseLocation
          .split(',')
          .map((location) => new RegExp(location.trim(), 'i')), // Partial match, no ^ or $
      };
    }

    if ('availability' in queryObj) {
      queryObj.isAvailable =
        queryObj.availability === 'true' || queryObj.availability === true;
      delete queryObj.availability;
    }

    if ('minPrice' in queryObj || 'maxPrice' in queryObj) {
      const priceFilter: { $gte?: number; $lte?: number } = {};
      if ('minPrice' in queryObj) {
        priceFilter.$gte = Number(queryObj.minPrice);
      }
      if ('maxPrice' in queryObj) {
        priceFilter.$lte = Number(queryObj.maxPrice);
      }

      (queryObj as any).rentPrice = priceFilter; // change the rentPrice as needed as that is the field name in the database

      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    console.log(queryObj);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  // sorting here
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 8;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.replace(/,/g, ' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const totalDoc = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 8;
    const totalPage = Math.ceil(totalDoc / limit);

    return {
      page,
      limit,
      totalDoc,
      totalPage,
    };
  }
}

export default QueryBuilder;
