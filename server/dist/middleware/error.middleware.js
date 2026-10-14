"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const auth_service_1 = require("../services/auth.service");
function notFoundHandler(req, res) {
    res.status(404).json({
        success: false,
        data: null,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
function errorHandler(err, _req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) {
    if (err instanceof auth_service_1.AppError) {
        return res
            .status(err.statusCode)
            .json({ success: false, data: null, message: err.message });
    }
    // Mongoose validation error — schema rules were violated
    // to this (add the console.error line):
    if (err instanceof Error && err.name === "ValidationError") {
        console.error("[validation error]", err.message); // temp — shows exact field that failed
        return res
            .status(400)
            .json({ success: false, data: null, message: "Invalid data" });
    }
    // Mongoose cast error — usually a malformed ObjectId
    if (err instanceof Error && err.name === "CastError") {
        return res
            .status(400)
            .json({ success: false, data: null, message: "Invalid identifier" });
    }
    // Duplicate key (e.g. a race on the unique email index)
    if (err &&
        typeof err === "object" &&
        "code" in err &&
        err.code === 11000) {
        return res.status(409).json({
            success: false,
            data: null,
            message: "This record already exists",
        });
    }
    console.error("[unhandled error]", err);
    res.status(500).json({
        success: false,
        data: null,
        message: "Something went wrong on our end",
    });
}
