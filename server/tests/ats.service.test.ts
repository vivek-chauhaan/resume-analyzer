import {
  scoreContactInfo,
  scoreSkills,
  scoreEducation,
  scoreExperience,
  scoreFormatting,
  scoreKeywordMatch,
  runRuleBasedScoring,
} from "../src/services/ats.service";

describe("scoreContactInfo", () => {
  it("scores 0 when nothing is present", () => {
    expect(scoreContactInfo("no contact details here")).toBe(0);
  });

  it("scores highest with email, phone, and LinkedIn", () => {
    const text = "Reach me at jane@example.com, +1 (555) 123-4567, linkedin.com/in/jane";
    expect(scoreContactInfo(text)).toBe(10);
  });

  it("gives partial credit for email only", () => {
    expect(scoreContactInfo("Contact: jane@example.com")).toBe(5);
  });
});

describe("scoreSkills", () => {
  it("scores 0 with no Skills heading", () => {
    const { score } = scoreSkills("I know javascript and react");
    expect(score).toBe(0);
  });

  it("scores higher with more recognized keywords under a Skills heading", () => {
    const thin = scoreSkills("Skills: javascript").score;
    const rich = scoreSkills(
      "Skills: javascript, typescript, react, node, express, mongodb, docker, aws"
    ).score;
    expect(rich).toBeGreaterThan(thin);
  });

  it("never exceeds its 12-point weight", () => {
    const many = "Skills: " + Array(50).fill("javascript typescript react node").join(" ");
    expect(scoreSkills(many).score).toBeLessThanOrEqual(12);
  });
});

describe("scoreEducation", () => {
  it("rewards a heading, a degree keyword, and a year together", () => {
    expect(scoreEducation("Education: Bachelor of Science, 2020")).toBe(8);
  });

  it("scores 0 with none of the three signals", () => {
    expect(scoreEducation("I studied things")).toBe(0);
  });
});

describe("scoreExperience", () => {
  it("rewards a heading, a date range, and action verbs together", () => {
    const text = "Experience: 2019 - 2022 Led a team, built a platform, improved performance";
    expect(scoreExperience(text)).toBeGreaterThan(10);
  });
});

describe("scoreFormatting", () => {
  it("penalizes very short text", () => {
    expect(scoreFormatting("too short")).toBeLessThan(4);
  });

  it("rewards bullet points and a healthy word count", () => {
    const words = Array(200).fill("word").join(" ");
    const bullets = "- one\n- two\n- three\n- four";
    expect(scoreFormatting(`${words}\n${bullets}`)).toBeGreaterThanOrEqual(7);
  });
});

describe("scoreKeywordMatch", () => {
  it("returns 0 with no recognized skills", () => {
    expect(scoreKeywordMatch("gardening and cooking").score).toBe(0);
  });

  it("lists matched and missing keywords that don't overlap", () => {
    const { matched, missing } = scoreKeywordMatch("I use react and node daily");
    expect(matched).toEqual(expect.arrayContaining(["react", "node"]));
    expect(missing).not.toEqual(expect.arrayContaining(["react", "node"]));
  });
});

describe("runRuleBasedScoring", () => {
  const strongResume = `
    Contact: jane@example.com, +1 (555) 123-4567, linkedin.com/in/jane
    Skills: javascript, typescript, react, node, express, mongodb, docker, aws, git
    Education: Bachelor of Science in Computer Science, 2020
    Experience: 2020 - Present. Led a team, built scalable APIs, improved performance,
    reduced load time by 40%, deployed to production weekly.
    Projects: github.com/jane/portfolio — built with react and node
    Certifications: AWS Certified Solutions Architect
  `;

  it("scores a well-formed resume clearly higher than a sparse one", () => {
    const strong = runRuleBasedScoring(strongResume);
    const weak = runRuleBasedScoring("Just a name and nothing else.");
    expect(strong.overallScore).toBeGreaterThan(weak.overallScore);
  });

  it("never returns a score outside 0-85", () => {
    const result = runRuleBasedScoring(strongResume);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(85);
  });

  it("produces at least one strength for a well-formed resume", () => {
    const result = runRuleBasedScoring(strongResume);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it("produces at least one weakness for a sparse resume", () => {
    const result = runRuleBasedScoring("Just a name and nothing else.");
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });
});