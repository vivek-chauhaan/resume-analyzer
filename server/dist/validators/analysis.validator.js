"use strict";
// // add this import at the top:
// import { body, param } from "express-validator";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobMatchValidator = exports.getAnalysisValidator = exports.resumeIdParamValidator = void 0;
// // add this new export:
// export const jobMatchValidator = [
//   param("resumeId").isMongoId().withMessage("Invalid resume id"),
//   body("jobDescription")
//     .isString()
//     .trim()
//     .isLength({ min: 30 })
//     .withMessage("Paste a fuller job description (at least 30 characters) for an accurate match"),
// ];
const express_validator_1 = require("express-validator");
exports.resumeIdParamValidator = [
    (0, express_validator_1.param)("resumeId").isMongoId().withMessage("Invalid resume id"),
];
exports.getAnalysisValidator = [
    (0, express_validator_1.param)("resumeId").isMongoId().withMessage("Invalid resume id"),
    (0, express_validator_1.query)("all").optional().isBoolean().withMessage("all must be a boolean"),
];
exports.jobMatchValidator = [
    (0, express_validator_1.param)("resumeId").isMongoId().withMessage("Invalid resume id"),
    (0, express_validator_1.body)("jobDescription")
        .isString()
        .trim()
        .isLength({ min: 30 })
        .withMessage("Paste a fuller job description (at least 30 characters) for an accurate match"),
];
