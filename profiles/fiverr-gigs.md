# Fiverr Gig Listings — Christos Galaios

---

## Gig 1: I will build a custom MCP server for Claude AI integration

### Pricing

| | Basic — £150 | Standard — £500 | Premium — £1,200 |
|---|---|---|---|
| **Delivery** | 3 days | 7 days | 14 days |
| **Tools** | Up to 3 tools | Up to 8 tools | Up to 20 tools |
| **Data sources** | 1 (mock/static data) | 2 (real API/DB) | Unlimited |
| **Test suite** | Basic | Full unit tests | Full unit + integration |
| **Documentation** | README | README + setup guide | Full docs + video walkthrough |
| **Revisions** | 1 | 3 | Unlimited |
| **Source code** | Yes | Yes | Yes |

### Description

Your Claude Desktop is powerful — but right now it can only read and respond. I'll build the MCP server that lets it actually **do things** in your business.

Model Context Protocol (MCP) is Anthropic's standard for connecting Claude to external systems. With a custom MCP server, Claude can search your CRM, create tasks, query your database, send notifications, and pull live data — all through natural conversation.

**What you get:**
- TypeScript MCP server built with the official `@modelcontextprotocol/sdk`
- Custom tools tailored to your specific business systems
- Proper error handling and input validation
- Claude Desktop configuration file so you're up and running immediately
- Test suite so you know it works

**I've built 110+ MCP tools across 14 production modules.** This isn't my first server.

**Common use cases:**
- CRM integration (HubSpot, Salesforce, custom)
- Project management (Notion, Linear, Jira)
- Database queries (PostgreSQL, SQLite, MySQL)
- Internal APIs and business tools
- Google Workspace integration

### FAQs

**Q: Do I need to know how to code?**
A: No. I deliver a complete, ready-to-run server with setup instructions written for non-developers.

**Q: What if I need tools for a system not listed?**
A: If it has an API or a database I can connect to, I can build a tool for it. Message me first to confirm.

**Q: Can I use this with Claude.ai or just Claude Desktop?**
A: MCP currently works with Claude Desktop. Anthropic is expanding MCP support — I'll advise you on the best current approach.

**Q: What do you need from me to start?**
A: A description of the tools you want, API documentation or database schema for the systems involved, and access credentials (we'll handle these securely).

### Requirements from buyer
- Description of the tools/actions you need Claude to perform
- API documentation or database schema for target systems
- Test API credentials or sandbox access
- Preferred programming language (TypeScript recommended, Node.js required)

---

## Gig 2: I will automate your business workflow using AI and Claude

### Pricing

| | Basic — £200 | Standard — £600 | Premium — £1,500 |
|---|---|---|---|
| **Delivery** | 5 days | 10 days | 21 days |
| **Automations** | 1 simple workflow | 1 complex workflow | Up to 3 workflows |
| **AI steps** | 1 Claude call | Multiple Claude calls | Multi-step AI pipeline |
| **Integrations** | 2 systems | 3 systems | 5+ systems |
| **Error handling** | Basic | Full retry logic | Full + monitoring |
| **Documentation** | README | Setup guide | Full runbook |
| **Revisions** | 1 | 3 | Unlimited |

### Description

Manual processes cost you time, introduce errors, and don't scale. I'll replace them with AI-powered automation pipelines that run reliably without you.

I build end-to-end workflows using Claude for the intelligent steps and TypeScript, n8n, or Make.com for the orchestration — depending on what fits your stack.

**Examples of what I build:**
- Customer feedback intake → AI categorisation → CRM update → Slack alert
- Document arrival → AI extraction → spreadsheet → email notification
- Lead form submission → AI qualification → CRM → personalised follow-up
- Daily data pull → AI analysis → report → stakeholder email

**What sets my work apart:**
Every automation I ship has proper error handling, retry logic, and logging. When something goes wrong at 3am, the system recovers gracefully and you get notified in the morning — not a 500 error that silently dropped data.

### FAQs

**Q: I already have n8n / Make.com — can you work with what I have?**
A: Yes. I can extend existing workflows or rebuild them with AI steps added.

**Q: How much does the AI part cost to run?**
A: Claude API costs are typically £0.50–£5 per 1,000 automated tasks depending on complexity. I'll give you an estimate for your specific workflow.

**Q: Can you automate workflows that involve private/sensitive data?**
A: Yes. I can design workflows that keep data on-premise or use self-hosted models if data privacy is a requirement.

### Requirements from buyer
- Description of the current manual process
- List of tools/systems involved (with API access if available)
- Volume expectations (how many records/triggers per day?)
- Any compliance or data handling requirements

---

## Gig 3: I will build a multi-agent AI pipeline for your business

### Pricing

| | Basic — £300 | Standard — £800 | Premium — £2,000 |
|---|---|---|---|
| **Delivery** | 7 days | 14 days | 28 days |
| **Agents** | 2 agents | Up to 4 agents | Up to 8 agents |
| **Complexity** | Sequential pipeline | Branching logic | Full autonomous system |
| **Human-in-loop** | No | Optional checkpoints | Configurable |
| **Test coverage** | Unit tests | Unit + integration | Full test suite |
| **Documentation** | README | Architecture diagram + README | Full docs + handoff session |
| **Revisions** | 1 | 3 | Unlimited |

### Description

Some tasks are too complex for a single AI call. Multi-agent systems break complex work into specialised agents that collaborate, check each other's work, and produce outputs that a single prompt never could.

I design and build multi-agent architectures using Claude, with each agent having a specific role, clear inputs/outputs, and proper handoff logic between stages.

**What multi-agent systems are good for:**
- Content pipelines: research agent → writer agent → editor agent → publisher agent
- Data processing: extraction agent → enrichment agent → validation agent → storage agent
- Decision workflows: analysis agent → recommendation agent → approval agent → action agent
- Customer operations: intake agent → routing agent → specialist agent → follow-up agent

**My background:**
I've built multi-agent systems in production and published research on autonomous agent architectures in IEEE conference proceedings (15 citations). I understand both the theoretical patterns and the practical failure modes.

**What you get:**
- Designed agent architecture with clear role separation
- TypeScript implementation with typed interfaces between agents
- Configurable human-in-the-loop checkpoints
- Full test suite with mocked agents for CI
- Architecture diagram and operational runbook

### FAQs

**Q: How is this different from a single Claude call with a long prompt?**
A: Multi-agent systems allow specialisation, parallelism, error recovery at each stage, and outputs that can be validated before being passed forward. They're significantly more reliable for complex tasks.

**Q: How do I monitor the system once it's running?**
A: I include structured logging and a monitoring setup. For Premium tier I'll configure alerts and a simple dashboard.

**Q: Can agents use tools/external data?**
A: Yes — agents can have MCP tools, API access, database queries, or any external integration you need.

### Requirements from buyer
- Description of the end-to-end task you want to automate
- Examples of good outputs (what does success look like?)
- Volume and frequency expectations
- Systems the agents need to interact with
