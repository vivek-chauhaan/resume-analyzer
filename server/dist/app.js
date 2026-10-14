"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const resume_routes_1 = __importDefault(require("./routes/resume.routes"));
const analysis_routes_1 = __importDefault(require("./routes/analysis.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const publicAnalysis_routes_1 = __importDefault(require("./routes/publicAnalysis.routes"));
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    // add this above the route mounts:
    const authLimiter = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 20, // 20 requests per IP per window
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            data: null,
            message: "Too many attempts. Try again later.",
        },
    });
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: env_1.env.clientUrl, credentials: true }));
    app.use((0, morgan_1.default)(env_1.env.nodeEnv === "development" ? "dev" : "combined"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.get("/api/health", (_req, res) => {
        res.status(200).json({
            success: true,
            data: { status: "ok" },
            message: "Server is healthy",
        });
    });
    app.use("/api/auth", authLimiter, auth_routes_1.default);
    app.use("/api/resume", resume_routes_1.default);
    app.use("/api/analysis", analysis_routes_1.default);
    app.use("/api/dashboard", dashboard_routes_1.default);
    app.use("/api/public", publicAnalysis_routes_1.default);
    app.use(error_middleware_1.notFoundHandler);
    app.use(error_middleware_1.errorHandler);
    return app;
}
