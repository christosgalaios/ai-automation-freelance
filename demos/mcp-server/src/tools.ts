import { MOCK_CONTACTS, taskStore, type Task } from './data.js';
import { randomUUID } from 'crypto';

export function searchContacts(query: string, tag?: string): object {
  const q = query.toLowerCase();
  let results = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q)
  );
  if (tag) {
    results = results.filter((c) => c.tags.includes(tag.toLowerCase()));
  }
  return {
    count: results.length,
    contacts: results,
  };
}

export interface CreateTaskInput {
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export function createTask(input: CreateTaskInput): Task {
  const task: Task = {
    id: randomUUID(),
    title: input.title,
    description: input.description,
    assignee: input.assignee,
    priority: input.priority,
    status: 'todo',
    createdAt: new Date().toISOString(),
    dueDate: input.dueDate,
  };
  taskStore.push(task);
  return task;
}

export function getAnalytics(period: string): object {
  const data: Record<string, object> = {
    '7d': {
      period: 'Last 7 days',
      pageViews: 4821,
      uniqueVisitors: 2134,
      sessions: 2891,
      bounceRate: '38.2%',
      avgSessionDuration: '3m 42s',
      conversions: 47,
      conversionRate: '1.63%',
      revenue: 3840,
      currency: 'GBP',
      topPages: [
        { path: '/services', views: 1204 },
        { path: '/', views: 986 },
        { path: '/pricing', views: 731 },
      ],
      trafficSources: {
        organic: '42%',
        direct: '28%',
        referral: '18%',
        social: '12%',
      },
    },
    '30d': {
      period: 'Last 30 days',
      pageViews: 18340,
      uniqueVisitors: 7821,
      sessions: 11203,
      bounceRate: '35.7%',
      avgSessionDuration: '4m 12s',
      conversions: 189,
      conversionRate: '1.69%',
      revenue: 15240,
      currency: 'GBP',
      topPages: [
        { path: '/services', views: 4821 },
        { path: '/', views: 3842 },
        { path: '/pricing', views: 2910 },
      ],
      trafficSources: {
        organic: '45%',
        direct: '25%',
        referral: '20%',
        social: '10%',
      },
    },
  };

  return data[period] ?? data['7d'];
}

export function sendNotification(
  channel: string,
  message: string,
  priority: 'low' | 'normal' | 'high' = 'normal'
): object {
  const timestamp = new Date().toISOString();
  const notification = {
    id: randomUUID(),
    channel,
    message,
    priority,
    timestamp,
    status: 'sent',
  };
  console.log(
    `[NOTIFICATION ${timestamp}] [${priority.toUpperCase()}] -> ${channel}: ${message}`
  );
  return notification;
}

export function generateReport(reportType: string, startDate: string, endDate: string): object {
  const analytics = getAnalytics('30d') as Record<string, unknown>;
  const tasks = taskStore;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;

  return {
    reportId: randomUUID(),
    reportType,
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
    summary: {
      totalContacts: MOCK_CONTACTS.length,
      activeContacts: MOCK_CONTACTS.filter(
        (c) => new Date(c.lastContacted) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
      totalTasks: tasks.length,
      completedTasks,
      taskCompletionRate: tasks.length > 0 ? `${Math.round((completedTasks / tasks.length) * 100)}%` : 'N/A',
      revenue: analytics['revenue'],
      conversions: analytics['conversions'],
    },
    highlights: [
      'MCP server processed 847 tool calls this period',
      'Average response time: 142ms',
      'Zero downtime — 100% uptime',
      `${MOCK_CONTACTS.length} contacts in CRM`,
    ],
  };
}
