const { SuccessResponse } = require("../responseHandle/success.response");
const StatisticsService = require("../services/statistics.service");

class StatisticsController {
    getMonthlyStatistics = async (req, res, next) => {
        const statistics = await StatisticsService.getMonthlyStatistics(req.query);
        new SuccessResponse({
            message: "Lấy thông tin thống kê thành công",
            data: statistics,
        }).send(res);
    };

    getRangeStatistics = async (req, res, next) => {
        const statistics = await StatisticsService.getRangeStatistics(req.query);
        new SuccessResponse({
            message: "Lấy thông tin thống kê thành công",
            data: statistics,
        }).send(res);
    }
}

module.exports = new StatisticsController();