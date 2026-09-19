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

export const generateDoubtAnswer = async ({
  question,
  conversation = [],
}) => {
  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const conversationText = conversation
    .map((message) => {
      return `${message.role}: ${message.content}`;
    })
    .join("\n");

  const prompt = `
You are SkillPath AI, an educational AI assistant.

Your job is to help students understand programming,
technology, computer science and career-related concepts.

Student's question:
${question}

Previous conversation:
${conversationText || "No previous conversation."}

Instructions:

1. Explain the concept clearly.
2. Assume the student may be a beginner unless context suggests otherwise.
3. Use simple language.
4. Give practical examples where useful.
5. For programming questions, provide correct code examples.
6. Explain the code instead of only giving code.
7. Break difficult concepts into smaller parts.
8. Do not invent facts.
9. If the question is ambiguous, explain the likely interpretation.
10. Encourage learning rather than simply giving unexplained answers.

Structure your response when appropriate:

## Short Answer

## Explanation

## Example

## Key Points

Keep the answer focused and educational.
`;

  if (!client) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Add a valid key to your backend .env file before asking a doubt."
    );
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt,
  });

  return response.output_text;
};