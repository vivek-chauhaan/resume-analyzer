"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeIdParamValidator = exports.listResumesValidator = void 0;
const express_validator_1 = require("express-validator");
exports.listResumesValidator = [
    (0, express_validator_1.query)("page").optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.query)("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
    (0, express_validator_1.query)("sortBy").optional().isIn(["createdAt", "originalFileName", "status"]),
    (0, express_validator_1.query)("order").optional().isIn(["asc", "desc"]),
    (0, express_validator_1.query)("status").optional().isIn(["uploaded", "analyzing", "analyzed", "failed"]),
    (0, express_validator_1.query)("search").optional().isString().trim(),
];
exports.resumeIdParamValidator = [(0, express_validator_1.param)("id").isMongoId().withMessage("Invalid resume id")];
