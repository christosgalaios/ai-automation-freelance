import Anthropic from '@anthropic-ai/sdk';

export interface JobDetails {
  jobTitle: string;
  jobDescription: string;
  budget?: string;
  clientLocation?: string;
  keyRequirements: string[];
}

export interface ProposalResult {
  text: string;
  wordCount: number;
  jobTitle: string;
  generatedAt: string;
}

export const BANNED_PHRASES = [
  "I'm excited about this opportunity",
  "I'd love to help",
  "I am excited",
  "I would love to",
  "great opportunity",
  "perfect fit",
  "passionate about",
  "I am passionate",
];

const SYSTEM_PROMPT = `You are Christos Galaios, an AI Automation Engineer based in Bristol, UK.
You write concise, human, confident Upwork proposals. Never generic. Never salesy.

PROFILE:
- Built 110+ MCP server tools across 14 production modules
- 6,300+ test assertions across production codebases
- Multi-agent workflow architect
- Electron desktop app developer
- IEEE-published researcher (15 citations)
- Former Technical Lead of a team of 12
- BSc First Class Honours, Computer Games Programming
- Site: https://christosgalaios.vercel.app

PROPOSAL STRUCTURE (follow exactly):
1. Opening Hook — 1 sentence that proves you read the job post. Reference a SPECIFIC detail.
2. Relevance — 2-3 sentences connecting exact experience to their need.
3. Approach — 3-4 sentences outlining how you'd tackle their specific project. Mention specific technologies.
4. Proof — 1 sentence: IEEE paper, team lead of 12, First Class Honours (pick the most relevant).
5. CTA — 1 sentence proposing a quick call or asking a smart clarifying question.
6. Sign-off:
Christos
AI Automation Engineer
https://christosgalaios.vercel.app

RULES:
- Never use: "I'm excited", "I'd love to", "great opportunity", "perfect fit", "passionate about"
- Always reference a specific detail from the job description in the first sentence
- Keep total length under 200 words
- Sound human, confident, specific
- Vary the opening hook style each time (question / bold statement / specific observation / metric)
- Use plain text only — no markdown, no bullet points in the proposal itself`;

export async function generateProposal(
  job: JobDetails,
  client: Anthropic
): Promise<ProposalResult> {
  const requirementsList = job.keyRequirements.length > 0
    ? `Key requirements: ${job.keyRequirements.join(', ')}`
    : '';

  const userMessage = `Write a proposal for this job:

Title: ${job.jobTitle}
${job.clientLocation ? `Client location: ${job.clientLocation}` : ''}
${job.budget ? `Budget: ${job.budget}` : ''}
${requirementsList}

Job Description:
${job.jobDescription}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text in proposal response');
  }

  const text = textBlock.text.trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    wordCount,
    jobTitle: job.jobTitle,
    generatedAt: new Date().toISOString(),
  };
}

export function getAnthropicClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      'ANTHROPIC_API_KEY is not set.\n' +
        'Add it to your shell environment:\n' +
        '  export ANTHROPIC_API_KEY=sk-ant-...\n' +
        'Or copy env.example to .env and source it.'
    );
  }
  return new Anthropic({ apiKey: key });
}
