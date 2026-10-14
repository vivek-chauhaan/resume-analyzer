"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const dashboard_service_1 = require("../services/dashboard.service");
exports.getStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await (0, dashboard_service_1.getDashboardStats)(req.userId);
    res.status(200).json({ success: true, data: stats, message: "Dashboard stats fetched" });
});
