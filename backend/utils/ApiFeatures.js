class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // Product.find is the query
    this.queryStr = queryStr; // ?category = food
  }

  search() {
    const keyword = this.queryStr.keyword
      ? { name: { $regex: this.queryStr.keyword, $options: "i" } }
      : {};

    console.log("keyword", keyword);
    this.query = this.query.find({ ...keyword });
    // console.log(this.query);
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    console.log(queryCopy);

    //Removing some fields
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // filters for price
    let queryStr = JSON.stringify(queryCopy);
    console.log(queryStr);
    queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `${key}`);
    console.log(queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
}

module.exports = ApiFeatures;
