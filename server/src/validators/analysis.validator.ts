// // add this import at the top:
// import { body, param } from "express-validator";

// // add this new export:
// export const jobMatchValidator = [
//   param("resumeId").isMongoId().withMessage("Invalid resume id"),
//   body("jobDescription")
//     .isString()
//     .trim()
//     .isLength({ min: 30 })
//     .withMessage("Paste a fuller job description (at least 30 characters) for an accurate match"),
// ];

import { body, param, query } from "express-validator";

export const resumeIdParamValidator = [
  param("resumeId").isMongoId().withMessage("Invalid resume id"),
];

export const getAnalysisValidator = [
  param("resumeId").isMongoId().withMessage("Invalid resume id"),

  query("all").optional().isBoolean().withMessage("all must be a boolean"),
];

export const jobMatchValidator = [
  param("resumeId").isMongoId().withMessage("Invalid resume id"),

  body("jobDescription")
    .isString()
    .trim()
    .isLength({ min: 30 })
    .withMessage(
      "Paste a fuller job description (at least 30 characters) for an accurate match",
    ),
];
