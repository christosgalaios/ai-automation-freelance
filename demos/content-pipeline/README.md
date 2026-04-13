# Content Pipeline Agent

An AI-powered content pipeline that turns a single topic into a complete content strategy: 5 platform-specific social posts, a blog outline, hashtag sets, and an optimal posting schedule.

## Features

- 5 social media post variations (Twitter, LinkedIn, Instagram, Facebook, Threads)
- Blog post outline with SEO keywords and read-time estimate
- Categorised hashtag suggestions (primary, secondary, niche)
- Platform-specific posting schedule with rationale
- Zod schema validation on all output
- Retry logic with exponential backoff
- Full test suite with mocked Anthropic SDK

## Setup

```bash
cd demos/content-pipeline
npm install
```

Set your API key (copy env.example from repo root):
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
npm run build
node dist/index.js "AI automation for small businesses"
```

## Tests

```bash
npm test
```

Tests mock the Anthropic SDK — no API key required.

## Tech Stack

- TypeScript (strict mode)
- `@anthropic-ai/sdk` (claude-sonnet-4-6)
- Zod for schema validation
- Vitest
