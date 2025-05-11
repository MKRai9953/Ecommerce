const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then((data) =>
      console.log(`Connected to MongoDB: ${data.connection.host}`)
    )
    .catch((err) => console.log(err));
};

module.exports = connectDB;
