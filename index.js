const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
require("./src/dbs/init.mongodb");

const app = express();
const PORT = process.env.PORT || 8088;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());

app.use(require("./src/routes")); // Kiểm tra file này có đúng không?

// Route mặc định
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Xử lý favicon.ico (tránh lỗi 404)
app.get("/favicon.ico", (req, res) => res.status(204));

// Middleware xử lý 404
app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ status: "error", message: "Not found" });
});

// Middleware xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Kiểm tra các route đã load
console.log("Routes loaded:", app._router.stack.map(r => r.route?.path).filter(Boolean));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
