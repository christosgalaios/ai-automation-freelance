# Multi-Tool MCP Server Demo

A production-ready Model Context Protocol (MCP) server with 5 tools that connect Claude to business systems.

## Tools

| Tool | Description |
|------|-------------|
| `search_contacts` | Search a mock CRM with 20 contacts by name, email, company, or role |
| `create_task` | Create tasks in an in-memory project management store |
| `get_analytics` | Get page views, conversions, and revenue analytics |
| `send_notification` | Send mock notifications (logs to console with timestamp) |
| `generate_report` | Generate summary reports from CRM + task + analytics data |

## Setup

```bash
cd demos/mcp-server
npm install
npm run build
```

## Run

```bash
npm start
```

The server runs on stdio and is ready to connect to Claude Desktop.

## Claude Desktop Config

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ai-automation-demo": {
      "command": "node",
      "args": ["/absolute/path/to/demos/mcp-server/dist/index.js"]
    }
  }
}
```

## Tests

```bash
npm test
```

## Tech Stack

- TypeScript (strict mode)
- `@modelcontextprotocol/sdk` v1.0
- Vitest
