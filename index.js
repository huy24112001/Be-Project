const express = require("express");
var morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const PORT = 8088 || process.env.PORT;
const cors = require("cors");

dotenv.config();
require("./src/dbs/init.mongodb");

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(require("./src/routes"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});


app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
