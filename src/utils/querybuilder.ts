import { HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { DefaultMessage, ResponseStatus } from '../constants';

export const getFieldsForSearch = (body: any, fields: string[]) => {
  const reqField = body?.filters?.search?.field;
  return reqField ? [reqField] : fields;
};

export const getFiltersObject = (
  payload: {
    page: number;
    limit: number;
    sort: string | any;
    filters: any;
  },
  searchFields: string[],
) => {
  const object = {
    limit: payload?.limit || '',
    skip: payload?.limit ? payload?.limit * (payload?.page - 1) : 0,
    sort: payload.sort ? getSort(payload.sort) : '-_id',
    filters: {},
  };
  object['filters'] = queryBuilder(payload.filters || {}, searchFields);
  delete object.filters['search'];
  return object;
};

// To form sort
function getSort(sort) {
  if (!sort) return '-_id';
  if (typeof sort === 'string') {
    const arr = sort.split(':');
    let value = arr[1] === 'asc' ? arr[0] : `-${arr[0]}`;
    return value;
  }
  return sort;
}

function queryBuilder(payload: any = {}, searchFields) {
  const query = {};
  const fields = Object.keys(payload);
  if (fields?.length === 0) {
    return query;
  }
  fields.forEach((key) => {
    if (key === 'search') {
      if (!payload?.search.value) return;
      query['$or'] = searchFields.map((field) => ({
        [field]: {
          $regex: `^${payload?.search.value}.*`,
          $options: 'i',
        },
      }));
      return;
    }
    if (String(payload[key]?.value).length > 0) {
      query[key] = getFiltersQuery(payload[key]?.type, payload[key].value);
    }
  });
  return query;
}

function getFiltersQuery(type: string, value: any) {
  const range_type = ['range', 'date_range'];
  const operators = {
    like: {
      $regex: `^.*${value}.*`,
      $options: 'i',
    },
    array: { $in: value },
    range: { $gte: value?.[0], $lte: value?.[1] },
    gt: { $gt: value },
    lt: { $lt: value },
    gte: { $gte: value },
    lte: { $lte: value },
    eq: { $eq: value },
    ne: { $ne: value },
    nin: { $nin: value },
    date: new Date(value),
    date_range: { $gte: new Date(value?.[0]), $lte: new Date(value?.[1]) },
  };
  if (!operators[type]) {
    return value;
  }
  if (range_type.includes(type) && value.length !== 2) {
    throw new HttpException(
      DefaultMessage.VALUE_LENGTH_DIFFER,
      ResponseStatus.BAD_REQUEST,
    );
  }
  return operators[type];
}

export const findAndPaginateData = async (
  payload,
  model: Model<any>,
  populate = null,
) => {
  const { skip, limit, sort, filters } = payload;
  let data;
  if (populate) {
    data = await model.find(filters).sort(sort).populate(populate);
  } else {
    data = await model.find(filters).sort(sort);
  }
  const total_count: number = data.length;
  const total_page: number = limit ? Math.ceil(total_count / limit) : 1;
  const startIndex = skip;
  const endIndex = limit ? skip + limit : total_count;
  const paginatedData = data.slice(startIndex, endIndex);
  return { data: paginatedData, total_count, total_page };
};

export const convertToUppercase = (word: string) => {
  const res = word.toUpperCase().split(' ').join('_');
  return res;
};

export const setDateField = (dateStr) => {
  let date = new Date(dateStr);
  // .toLocaleString("en-US", {timeZone: getUserResponse?.data?.otherSettings?.timezone});
  return `${date?.getDate() < 10 ? '0' + date?.getDate() : date?.getDate()}-${
    date?.getMonth() + 1 < 10
      ? '0' + (date?.getMonth() + 1)
      : date?.getMonth() + 1
  }-${date?.getFullYear()}`;
};
