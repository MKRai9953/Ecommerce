const dotenv = require("dotenv");
const express = require("express");
const app = express();
const path = require("path");
const connectDB = require("./database/Database");
const error = require("./middleware/error");
const qs = require("qs");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

//
process.on("uncaughtException", (err) => {
  console.log(err.message);
  process.exit(1);
});

// DB connect
connectDB();

// Middleware
app.use(express.json());
app.set("query parser", (str) => qs.parse(str));

// Route Imports
const productRoutes = require("./routes/ProductRoutes");
const userRoutes = require("./routes/UserRoutes");

// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);

//Error for middleware
app.use(error);

function startServer() {
  const server = app.listen(process.env.PORT ?? 4000, () => {
    console.log(`http://localhost:${process.env.PORT ?? 4000}`);
  });

  // Unhandled Promise Rejection

  process.on("unhandledRejection", (err) => {
    console.log(err, "\n", err.message);
    console.log("SHutting down the error due to unhandled Promise Rejections");
    server.close(() => {
      process.exit(1);
    });
  });
}

startServer();
