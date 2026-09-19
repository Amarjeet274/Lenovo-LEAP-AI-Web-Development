import OpenAI from "openai";

const normalizeApiKey = (value) => {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  const invalidValues = [
    "false",
    "null",
    "undefined",
    "your_api_key_here",
    "your-api-key-here",
  ];

  if (invalidValues.includes(trimmed.toLowerCase())) {
    return null;
  }

  return trimmed;
};

const apiKey = normalizeApiKey(process.env.OPENAI_API_KEY);

const client = apiKey ? new OpenAI({ apiKey }) : null;

export const generateProjectRecommendations = async ({
  skills = [],
  interests = [],
  learningGoals = [],
  educationLevel = "",
}) => {
  const prompt = `
You are SkillPath AI, an educational project recommendation engine.

Recommend practical software development projects for a student.

STUDENT PROFILE

Education Level:
${educationLevel || "Not specified"}

Skills:
${skills.length ? skills.join(", ") : "Not specified"}

Interests:
${interests.length ? interests.join(", ") : "Not specified"}

Learning Goals:
${learningGoals.length ? learningGoals.join(", ") : "Not specified"}

Requirements:

1. Generate exactly 6 project recommendations.
2. Projects must match the student's current skills and goals.
3. Include a mixture of difficulty levels when appropriate.
4. Do not recommend projects requiring technologies completely unrelated
   to the student's profile.
5. Projects should be practical and portfolio-worthy.
6. Avoid generic projects when a more specific project is possible.
7. Explain why each project is suitable for this student.
8. Include useful features that could actually be implemented.
9. Include technologies required.
10. Include learning outcomes.
11. Include an estimated duration in weeks.
12. Include resource suggestions.
13. Do not invent specific URLs. If you cannot provide a reliable URL,
    leave the URL empty.
14. Return ONLY valid JSON.

Return exactly this structure:

{
  "projects": [
    {
      "title": "Project title",
      "description": "Detailed project description",
      "difficulty": "beginner",
      "estimatedWeeks": 3,
      "skills": [
        "JavaScript"
      ],
      "technologies": [
        "React",
        "Node.js"
      ],
      "learningOutcomes": [
        "Learn REST APIs"
      ],
      "features": [
        "Authentication",
        "Dashboard"
      ],
      "resources": [
        {
          "title": "Resource title",
          "url": "",
          "type": "documentation"
        }
      ],
      "reason": "Why this project matches the student"
    }
  ]
}
`;

  if (!client) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add a valid key to your backend .env file before generating project recommendations."
    );
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt,
  });

  const output = response.output_text?.trim();

  if (!output) {
    throw new Error("AI returned an empty response");
  }

  let parsed;

  try {
    parsed = JSON.parse(output);
  } catch (error) {
    console.error("Project AI JSON error:", output);
    throw new Error("AI returned invalid project data");
  }

  if (!Array.isArray(parsed.projects)) {
    throw new Error("Invalid project recommendation format");
  }

  return parsed.projects;
};