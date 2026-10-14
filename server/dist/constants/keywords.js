"use strict";
// Illustrative dictionaries — extend freely as you tune the scorer against real resumes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTION_VERBS = exports.SECTION_HEADINGS = exports.CERTIFICATION_KEYWORDS = exports.DEGREE_KEYWORDS = exports.SKILL_KEYWORDS = void 0;
exports.SKILL_KEYWORDS = [
    "javascript", "typescript", "react", "node", "express", "mongodb", "mongoose",
    "python", "fastapi", "django", "flask", "sql", "postgresql", "mysql", "redis",
    "docker", "kubernetes", "aws", "azure", "gcp", "git", "ci/cd", "rest api",
    "graphql", "html", "css", "tailwind", "redux", "next.js", "vue", "angular",
    "java", "spring", "c++", "c#", ".net", "golang", "rust", "machine learning",
    "data analysis", "pandas", "numpy", "tensorflow", "pytorch", "nlp",
];
exports.DEGREE_KEYWORDS = [
    "bachelor", "b.tech", "b.e.", "bsc", "b.sc", "master", "m.tech", "msc", "m.sc",
    "mba", "phd", "diploma", "associate degree",
];
exports.CERTIFICATION_KEYWORDS = [
    "certified", "certification", "aws certified", "pmp", "scrum master", "azure certified",
    "google certified", "comptia", "cisco", "coursera", "udemy certificate",
];
exports.SECTION_HEADINGS = {
    contact: [], // handled by regex, not headings
    skills: ["skills", "technical skills", "core competencies"],
    education: ["education", "academic background"],
    experience: ["experience", "work experience", "professional experience", "employment history"],
    projects: ["projects", "personal projects", "academic projects"],
    certifications: ["certifications", "certificates", "licenses"],
};
exports.ACTION_VERBS = [
    "led", "built", "developed", "designed", "implemented", "architected", "optimized",
    "launched", "managed", "improved", "created", "reduced", "increased", "automated",
    "deployed", "delivered", "collaborated", "mentored", "streamlined", "engineered",
];
