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

const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;

export const generateLearningRoadmap = async ({
  goal,
  currentLevel,
  currentSkills,
}) => {
  const prompt = `
You are an expert educational curriculum designer.

Create a personalized learning roadmap for a student.

Student goal:
${goal}

Current level:
${currentLevel}

Current skills:
${currentSkills.join(", ") || "None"}

Create a practical roadmap that takes the student
from their current level toward their stated goal.

Rules:

1. Create 4 to 8 phases.
2. Each phase must contain 2 to 6 topics.
3. Topics must be ordered logically.
4. Avoid repeating skills the student already knows unless
   they are necessary prerequisites.
5. Include practical learning.
6. Include estimated hours for each topic.
7. Include useful resource suggestions.
8. Keep the roadmap realistic.
9. Do not invent URLs.
10. Use official documentation URLs when possible.

Return ONLY valid JSON using exactly this structure:

{
  "totalEstimatedWeeks": 12,
  "phases": [
    {
      "phaseNumber": 1,
      "title": "Phase title",
      "description": "Short description",
      "estimatedWeeks": 2,
      "topics": [
        {
          "title": "Topic title",
          "description": "What the student should learn",
          "estimatedHours": 5,
          "completed": false,
          "resources": [
            {
              "title": "Resource name",
              "url": "https://example.com",
              "type": "documentation"
            }
          ]
        }
      ]
    }
  ]
}
`;

  if (!openai) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add a valid key to your backend .env file before generating a roadmap."
    );
  }

  const response =
    await openai.responses.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-5",
      input: prompt,
    });

  const output = response.output_text;

  if (!output) {
    throw new Error(
      "AI returned an empty response."
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(output);
  } catch (error) {
    console.error(
      "AI JSON parsing failed:",
      output
    );

    throw new Error(
      "AI returned invalid roadmap data."
    );
  }

  return parsed;
};