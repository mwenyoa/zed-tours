exports.filterQuery = (req) => {
  // remove non field query parameters
  const qString = { ...req.query };
  const IgnoredStrings = ["page", "fields", "sort", "limit"];
  IgnoredStrings.forEach((ignStr) => delete qString[ignStr]);
  // replace mongoose comaprison operator with its mongodb equivalent
  let queryStr = JSON.stringify(qString);
  queryStr = queryStr.replace(
    /\b(lt|lte|gt|gte)\b/g,
    (matched) => `$${matched}`
  );
  return JSON.parse(queryStr);
};

exports.sortQuery = (req, queryStr) => {
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryStr = queryStr.sort(sortBy);
    return queryStr;
  } else {
    queryStr = queryStr.sort("-created_at");
    return queryStr;
  }
};

exports.limitQuery = (req, queryStr) => {
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryStr = queryStr.select(fields);
    return queryStr;
  } else {
    queryStr = queryStr.select("-__v");
    return queryStr;
  }
};

exports.paginateQuery = async (req, queryStr, model) => {
  let page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
  const totalDocsCount = await model.countDocuments();
  const totalCount = totalDocsCount / limit;
  const lastPage = Math.floor(totalCount);
  page = page > lastPage ? lastPage : page;
  let skip = (page - 1) * limit;
  skip  = skip > limit ? limit : skip;
  queryStr = queryStr.skip(skip).limit(limit);
  return queryStr;
};
