"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const token_service_1 = require("../services/token.service");
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, data: null, message: "Not authenticated" });
    }
    const token = header.split(" ")[1];
    try {
        const payload = (0, token_service_1.verifyToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch {
        return res.status(401).json({ success: false, data: null, message: "Invalid or expired token" });
    }
}
