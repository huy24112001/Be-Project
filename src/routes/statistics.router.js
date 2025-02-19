const express = require("express");
const router = express.Router();
const asyncHandle = require("../helpers/asyncHandler");
const StatisticsController = require("../controllers/statistics.controller");

router.get("/monthly-statistics", asyncHandle(StatisticsController.getMonthlyStatistics));
router.get("/range-statistics", asyncHandle(StatisticsController.getRangeStatistics));

module.exports = router;
