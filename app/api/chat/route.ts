import { Groq } from "groq-sdk";
import type { StackBlueprint } from "@BaseCompose/types";
import { STACK_CONFIG, getOptions } from "@BaseCompose/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate available options dynamically from config
function generateOptionsText() {
  return Object.entries(STACK_CONFIG)
    .map(([category, config]) => {
      const options = getOptions(category as keyof typeof STACK_CONFIG);
      const optionsList = options.map((opt) => opt.key).join(" | ");
      return `- ${category}: ${optionsList} (or null)`;
    })
    .join("\n");
}

export async function POST(req: Request) {
  try {
    const { message, currentStack } = await req.json();

    const prompt = `You are a stack configuration assistant for a developer tool called "BaseCompose".

Current stack configuration:
${JSON.stringify(currentStack, null, 2)}

User message: "${message}"

Based on the user's message, determine if they want to:
1. Add a technology to the stack
2. Remove a technology from the stack
3. Download the current stack
4. Just have a conversation

Available options:
${generateOptionsText()}

Respond with a JSON object in this exact format:
{
  "action": "modify" | "download" | "chat",
  "changes": {
    "intent": "saas" | "api" | null,
    "frontend": "nextjs" | null,
    "backend": "node" | "fastapi" | null,
    "database": "postgres" | null,
    "auth": "authjs" | null
  },
  "message": "A brief, friendly response to the user"
}

Rules:
- If user mentions "download", "generate", "zip", set action to "download"
- If user wants to add/remove tech, set action to "modify" and specify changes
- Only include changed fields in "changes" object
- Use null to remove a technology
- Keep responses concise and developer-friendly
- If just chatting, set action to "chat" and changes to {}
- When responding about unsupported tech, use markdown and include a friendly note about contributing or helping expand support

Examples:
- "add nextjs" → modify with frontend: "nextjs"
- "I need auth" → modify with auth: "authjs"
- "remove database" → modify with database: null
- "download it" → download with current stack
- "what can you do?" → chat with helpful message
- "I need PostgreSQL" → chat with markdown explaining it's unsupported + link to contribute

When mentioning unsupported tech, include something like:
"Want to help us add support for this? [Contribute on GitHub](https://github.com/icancodefyi/basecompose) or [See contribution guidelines](https://github.com/icancodefyi/basecompose/blob/main/CONTRIBUTING.md)"`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "moonshotai/kimi-k2-instruct-0905",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const text =
      chatCompletion.choices[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({
        action: "chat",
        changes: {},
        message: "I can help you build your stack. Try saying 'add nextjs' or 'I need authentication'.",
      });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return Response.json(parsed);
  } catch (error) {
    console.error("Chat error:", error);
    return Response.json(
      {
        action: "chat",
        changes: {},
        message: "I'm having trouble understanding. Can you rephrase that?",
      },
      { status: 200 }
    );
  }
}
