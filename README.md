# AI Automation Freelance — Monorepo

Christos Galaios — AI Automation Engineer, Bristol UK.

Portfolio site, demo projects, proposal tools, and outreach templates for freelancing on Upwork and Fiverr.

## Quick Start

```bash
npm install
npm test          # run all tests
npm run build     # build the Next.js site
```

## Structure

```
ai-automation-freelance/
├── site/                    # Next.js 14 portfolio site (static export)
├── demos/
│   ├── mcp-server/          # 5-tool MCP server (TypeScript + MCP SDK)
│   ├── content-pipeline/    # Content pipeline agent (Claude + Zod)
│   └── workflow-automation/ # CSV watcher + AI enrichment
├── tools/
│   ├── proposal-gen/        # CLI proposal generator (Claude)
│   └── tracker/             # Proposal tracker CRM (SQLite)
├── profiles/
│   ├── upwork-profile.md
│   └── fiverr-gigs.md
├── templates/
│   ├── cold-email.md
│   ├── linkedin-messages.md
│   └── follow-up-sequence.md
└── proposals/               # Generated proposals (git-ignored)
```

## Prerequisites

- Node.js 20+
- npm 10+
- `ANTHROPIC_API_KEY` for running demos/tools live (not needed for tests)

## Setup

```bash
# 1. Clone
git clone https://github.com/christosgalaios/ai-automation-freelance.git
cd ai-automation-freelance

# 2. Install all workspace dependencies
npm install

# 3. Set API key (only needed to run live, not for tests)
export ANTHROPIC_API_KEY=sk-ant-...

# 4. Run all tests
npm test

# 5. Build the site
npm run build
```

## Demo Projects

### MCP Server (`demos/mcp-server/`)

Working MCP server with 5 tools. Connect to Claude Desktop:

```bash
cd demos/mcp-server && npm run build
# Add to claude_desktop_config.json — see demos/mcp-server/README.md
```

### Content Pipeline (`demos/content-pipeline/`)

```bash
cd demos/content-pipeline && npm run build
node dist/index.js "AI automation for small businesses"
```

### Workflow Automation (`demos/workflow-automation/`)

```bash
cd demos/workflow-automation && npm run build
node dist/index.js ./watch
# Drop sample-data/feedback.csv into ./watch to trigger processing
```

## Tools

### Proposal Generator (`tools/proposal-gen/`)

```bash
cd tools/proposal-gen && npm run build
node dist/index.js
# Prompts for job details, generates proposal, saves to /proposals/
```

### Proposal Tracker (`tools/tracker/`)

```bash
cd tools/tracker && npm run build
node dist/index.js add         # log a proposal
node dist/index.js list        # list all proposals
node dist/index.js update 1 won
node dist/index.js stats
node dist/index.js export
```

## Site

```bash
cd site && npm install && npm run build
# Static HTML exported to site/out/
# Deploy to Vercel: vercel --prod
```

## Tests

All tests use Vitest. Anthropic SDK calls are mocked — no API key needed.

```bash
npm test                    # run all tests from root
npm test --workspace=demos/mcp-server
npm test --workspace=demos/content-pipeline
npm test --workspace=demos/workflow-automation
npm test --workspace=tools/proposal-gen
npm test --workspace=tools/tracker
```

## Deployment

Site deploys to Vercel automatically via `vercel.json`. Push to `main` and it builds.

```bash
vercel --prod  # from site/ directory
```
