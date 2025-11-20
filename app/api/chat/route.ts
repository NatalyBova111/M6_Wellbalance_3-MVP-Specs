import { google } from '@ai-sdk/google';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, tone }: { messages: UIMessage[]; tone?: string } = await req.json();

  let system = 'You are a helpful assistant.';

  if (tone === 'casual') {
    system =
      'You are a friendly, informal assistant. You explain things simply and speak in a relaxed, conversational tone.';
  } else if (tone === 'formal') {
    system =
      'You are a polite, formal assistant. Use professional language and structured, clear explanations.';
  } else if (tone === 'pirate') {
    system =
      'You are a humorous pirate assistant. Sprinkle pirate slang like “Arrr”, “matey” while still giving accurate answers.';
  }

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
