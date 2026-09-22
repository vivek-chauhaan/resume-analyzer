import {
  SKILL_KEYWORDS,
  DEGREE_KEYWORDS,
  CERTIFICATION_KEYWORDS,
  SECTION_HEADINGS,
  ACTION_VERBS,
} from "../constants/keywords";

// ---- shared helpers -------------------------------------------------------

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase();
  return terms.some((t) => lower.includes(t));
}

function countMatches(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t));
}

function hasHeading(text: string, headings: string[]): boolean {
  return containsAny(text, headings);
}

// clamp a raw score into [0, maxWeight]
function clamp(value: number, maxWeight: number): number {
  return Math.max(0, Math.min(maxWeight, Math.round(value)));
}

// ---- individual component scorers -----------------------------------------
// Each returns a value already scaled to its own weight (see doc Section 7.1).

export function scoreContactInfo(text: string): number {
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text);
  const hasPhone = /(\+?\d[\d\s\-().]{8,}\d)/.test(text);
  const hasLinkedIn = /linkedin\.com\/[\w-]+/i.test(text);

  // 10 total: email counts most, phone next, LinkedIn is a bonus
  const weighted = (hasEmail ? 5 : 0) + (hasPhone ? 3 : 0) + (hasLinkedIn ? 2 : 0);
  return clamp(weighted, 10);
}

export function scoreSkills(text: string): { score: number; matched: string[] } {
  if (!hasHeading(text, SECTION_HEADINGS.skills)) {
    return { score: 0, matched: [] };
  }
  const matched = countMatches(text, SKILL_KEYWORDS);
  // heading present = base 4, plus up to 8 more scaled by keyword coverage
  const coverage = Math.min(1, matched.length / 8); // 8+ distinct skills = full coverage
  const score = clamp(4 + coverage * 8, 12);
  return { score, matched };
}

export function scoreEducation(text: string): number {
  const heading = hasHeading(text, SECTION_HEADINGS.education);
  const hasDegree = containsAny(text, DEGREE_KEYWORDS);
  const hasYear = /(19|20)\d{2}/.test(text);

  let score = 0;
  if (heading) score += 3;
  if (hasDegree) score += 3;
  if (hasYear) score += 2;
  return clamp(score, 8);
}

export function scoreExperience(text: string): number {
  const heading = hasHeading(text, SECTION_HEADINGS.experience);
  const hasDateRange = /(19|20)\d{2}\s*(-|–|to)\s*((19|20)\d{2}|present)/i.test(text);
  const verbHits = countMatches(text, ACTION_VERBS).length;
  const verbDensity = Math.min(1, verbHits / 6); // 6+ distinct action verbs = full marks

  let score = 0;
  if (heading) score += 5;
  if (hasDateRange) score += 4;
  score += verbDensity * 6;
  return clamp(score, 15);
}

export function scoreProjects(text: string): number {
  const heading = hasHeading(text, SECTION_HEADINGS.projects);
  const hasGithub = /github\.com\/[\w-]+/i.test(text);
  const techMentions = countMatches(text, SKILL_KEYWORDS).length;

  let score = 0;
  if (heading) score += 3;
  if (hasGithub) score += 2;
  score += Math.min(3, techMentions * 0.5);
  return clamp(score, 8);
}

export function scoreCertifications(text: string): number {
  const heading = hasHeading(text, SECTION_HEADINGS.certifications);
  const hasCertKeyword = containsAny(text, CERTIFICATION_KEYWORDS);

  let score = 0;
  if (heading) score += 3;
  if (hasCertKeyword) score += 2;
  return clamp(score, 5);
}

export function scoreFormatting(text: string): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const bulletDensity = (text.match(/[•\-*]\s/g) || []).length;
  // garbled-text ratio: fraction of characters that are unusual symbols/control chars
  const garbledChars = (text.match(/[^\x20-\x7E\s]/g) || []).length;
  const garbledRatio = text.length > 0 ? garbledChars / text.length : 0;

  let score = 0;
  if (wordCount >= 150 && wordCount <= 1200) score += 4; // not too thin, not a wall of text
  if (bulletDensity >= 3) score += 3;
  if (garbledRatio < 0.02) score += 1; // clean PDF extraction
  return clamp(score, 8);
}

export function scoreReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;

  // crude passive-voice heuristic: "was/were/been/being" + past participle-ish word
  const passiveHits = (text.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || []).length;
  const passiveRatio = sentences.length > 0 ? passiveHits / sentences.length : 0;

  let score = 4;
  if (avgSentenceLength > 30) score -= 2; // overly long sentences hurt ATS parsing too
  if (passiveRatio > 0.3) score -= 1;
  return clamp(score, 4);
}

export function scoreKeywordMatch(text: string): { score: number; matched: string[]; missing: string[] } {
  const matched = countMatches(text, SKILL_KEYWORDS);
  const missing = SKILL_KEYWORDS.filter((k) => !matched.includes(k));
  const matchPercentage = matched.length / SKILL_KEYWORDS.length;
  const score = clamp(matchPercentage * 15, 15);
  return { score, matched, missing };
}

// ---- strengths / weaknesses / suggestions ---------------------------------

function buildInsights(sectionScores: {
  contact: number;
  skills: number;
  education: number;
  experience: number;
  projects: number;
  certifications: number;
  formatting: number;
  readability: number;
}) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  if (sectionScores.contact >= 8) strengths.push("Contact information is complete and easy to find.");
  else {
    weaknesses.push("Contact information is incomplete.");
    suggestions.push("Add a professional email, phone number, and LinkedIn URL near the top.");
  }

  if (sectionScores.skills >= 10) strengths.push("Skills section is well-developed with relevant keywords.");
  else {
    weaknesses.push("Skills section is thin or missing.");
    suggestions.push("Add a dedicated Skills section listing your core technical skills.");
  }

  if (sectionScores.experience >= 12) strengths.push("Experience section uses strong action verbs and clear dates.");
  else {
    weaknesses.push("Experience section could be more results-driven.");
    suggestions.push("Start bullet points with action verbs (e.g. 'Led', 'Built') and quantify impact where possible.");
  }

  if (sectionScores.formatting < 5) {
    weaknesses.push("Formatting may hurt ATS parsing.");
    suggestions.push("Use consistent bullet points and avoid overly dense paragraphs.");
  }

  if (sectionScores.readability < 2) {
    weaknesses.push("Some sentences are long or written in passive voice.");
    suggestions.push("Prefer short, active-voice sentences (e.g. 'Reduced load time by 40%').");
  }

  return { strengths, weaknesses, suggestions };
}

// ---- main entry point -------------------------------------------------------

export interface RuleBasedResult {
  overallScore: number; // out of 85 — Day 5 adds the remaining 15 from the AI layer
  sectionScores: {
    contact: number;
    skills: number;
    education: number;
    experience: number;
    projects: number;
    certifications: number;
  };
  formattingScore: number;
  readabilityScore: number;
  keywordAnalysis: { matchedKeywords: string[]; missingKeywords: string[]; matchPercentage: number };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export function runRuleBasedScoring(extractedText: string): RuleBasedResult {
  const contact = scoreContactInfo(extractedText);
  const skills = scoreSkills(extractedText);
  const education = scoreEducation(extractedText);
  const experience = scoreExperience(extractedText);
  const projects = scoreProjects(extractedText);
  const certifications = scoreCertifications(extractedText);
  const formatting = scoreFormatting(extractedText);
  const readability = scoreReadability(extractedText);
  const keyword = scoreKeywordMatch(extractedText);

  const overallScore = clamp(
    contact + skills.score + education + experience + projects + certifications + formatting + readability + keyword.score,
    85
  );

  const { strengths, weaknesses, suggestions } = buildInsights({
    contact,
    skills: skills.score,
    education,
    experience,
    projects,
    certifications,
    formatting,
    readability,
  });

  const summary =
    overallScore >= 65
      ? "This resume is well-structured with good ATS compatibility. A few refinements could push it further."
      : "This resume has room for improvement in ATS compatibility — see the suggestions below.";

  return {
    overallScore,
    sectionScores: { contact, skills: skills.score, education, experience, projects, certifications },
    formattingScore: formatting,
    readabilityScore: readability,
    keywordAnalysis: {
      matchedKeywords: keyword.matched,
      missingKeywords: keyword.missing,
      matchPercentage: Math.round((keyword.matched.length / SKILL_KEYWORDS.length) * 100),
    },
    strengths,
    weaknesses,
    suggestions,
    summary,
  };
}
