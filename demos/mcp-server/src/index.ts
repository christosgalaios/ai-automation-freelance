import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  searchContacts,
  createTask,
  getAnalytics,
  sendNotification,
  generateReport,
} from './tools.js';

const server = new Server(
  { name: 'ai-automation-demo', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_contacts',
      description: 'Search the CRM for contacts by name, email, company, or role',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          tag: { type: 'string', description: 'Filter by tag (e.g. enterprise, startup, ai)' },
        },
        required: ['query'],
      },
    },
    {
      name: 'create_task',
      description: 'Create a new task in the project management system',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Task title' },
          description: { type: 'string', description: 'Task description' },
          assignee: { type: 'string', description: 'Person to assign the task to' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Task priority' },
          dueDate: { type: 'string', description: 'Due date (ISO 8601)' },
        },
        required: ['title', 'description', 'assignee', 'priority'],
      },
    },
    {
      name: 'get_analytics',
      description: 'Get analytics data including page views, conversions, and revenue',
      inputSchema: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d'], description: 'Time period for analytics' },
        },
        required: ['period'],
      },
    },
    {
      name: 'send_notification',
      description: 'Send a notification to a channel or person',
      inputSchema: {
        type: 'object',
        properties: {
          channel: { type: 'string', description: 'Notification channel (email, slack, sms)' },
          message: { type: 'string', description: 'Notification message' },
          priority: { type: 'string', enum: ['low', 'normal', 'high'], description: 'Priority level' },
        },
        required: ['channel', 'message'],
      },
    },
    {
      name: 'generate_report',
      description: 'Generate a summary report from CRM, task, and analytics data',
      inputSchema: {
        type: 'object',
        properties: {
          reportType: { type: 'string', enum: ['weekly', 'monthly', 'custom'], description: 'Report type' },
          startDate: { type: 'string', description: 'Start date (ISO 8601)' },
          endDate: { type: 'string', description: 'End date (ISO 8601)' },
        },
        required: ['reportType', 'startDate', 'endDate'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      case 'search_contacts': {
        const { query, tag } = args as { query: string; tag?: string };
        result = searchContacts(query, tag);
        break;
      }
      case 'create_task': {
        const input = args as {
          title: string;
          description: string;
          assignee: string;
          priority: 'low' | 'medium' | 'high';
          dueDate?: string;
        };
        result = createTask(input);
        break;
      }
      case 'get_analytics': {
        const { period } = args as { period: string };
        result = getAnalytics(period);
        break;
      }
      case 'send_notification': {
        const { channel, message, priority } = args as {
          channel: string;
          message: string;
          priority?: 'low' | 'normal' | 'high';
        };
        result = sendNotification(channel, message, priority);
        break;
      }
      case 'generate_report': {
        const { reportType, startDate, endDate } = args as {
          reportType: string;
          startDate: string;
          endDate: string;
        };
        result = generateReport(reportType, startDate, endDate);
        break;
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
