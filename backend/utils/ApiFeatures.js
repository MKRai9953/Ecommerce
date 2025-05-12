class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // Product.find is the query
    this.queryStr = queryStr; // ?category = food
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination() {}
}

module.exports = ApiFeatures;
