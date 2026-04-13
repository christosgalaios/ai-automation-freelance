# Workflow Automation Demo

Watches a directory for CSV files, enriches each row with Claude (categorisation, sentiment, summary), outputs a structured JSON report, and sends a mock Slack notification.

## Features

- Directory watcher (chokidar) — drop a CSV, processing starts automatically
- CSV validation with Zod schemas
- Claude enrichment: category, sentiment, summary, action required, priority
- Concurrent batch processing with rate limiting
- Structured JSON report output
- Mock Slack notification (logged to console)
- Full test suite with mocked Anthropic SDK

## Setup

```bash
cd demos/workflow-automation
npm install
```

Set your API key:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
npm run build
# Watch the default ./watch directory:
node dist/index.js
# Or specify a directory:
node dist/index.js /path/to/watch
```

Then drop a CSV into the watch directory. See `sample-data/feedback.csv` for the expected format.

### CSV Format

```csv
id,customer,feedback,product,date,rating
1,Acme Corp,Great product saves time,AI Workflow Pro,2026-04-01,5
```

## Tests

```bash
npm test
```

Tests mock the Anthropic SDK — no API key required.

## Tech Stack

- TypeScript (strict mode)
- chokidar (file watching)
- csv-parse (CSV parsing)
- `@anthropic-ai/sdk` (claude-sonnet-4-6)
- Zod (schema validation)
- Vitest
