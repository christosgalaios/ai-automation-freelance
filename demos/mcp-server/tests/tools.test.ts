import { describe, it, expect, beforeEach } from 'vitest';
import {
  searchContacts,
  createTask,
  getAnalytics,
  sendNotification,
  generateReport,
} from '../src/tools.js';
import { taskStore } from '../src/data.js';

beforeEach(() => {
  taskStore.length = 0;
});

describe('search_contacts', () => {
  it('finds contacts by name', () => {
    const result = searchContacts('Alice') as { count: number; contacts: unknown[] };
    expect(result.count).toBeGreaterThan(0);
    expect(result.contacts[0]).toMatchObject({ name: 'Alice Johnson' });
  });

  it('finds contacts by company', () => {
    const result = searchContacts('TechCorp') as { count: number; contacts: unknown[] };
    expect(result.count).toBeGreaterThan(0);
  });

  it('filters by tag', () => {
    const result = searchContacts('', 'ai') as { count: number; contacts: Array<{ tags: string[] }> };
    result.contacts.forEach((c) => expect(c.tags).toContain('ai'));
  });

  it('returns empty for no match', () => {
    const result = searchContacts('zzznomatch') as { count: number };
    expect(result.count).toBe(0);
  });
});

describe('create_task', () => {
  it('creates a task with required fields', () => {
    const task = createTask({
      title: 'Test task',
      description: 'Do something',
      assignee: 'Alice',
      priority: 'high',
    });
    expect(task.id).toBeTruthy();
    expect(task.title).toBe('Test task');
    expect(task.status).toBe('todo');
    expect(task.priority).toBe('high');
  });

  it('persists task to store', () => {
    createTask({ title: 'T1', description: 'D', assignee: 'B', priority: 'low' });
    expect(taskStore.length).toBe(1);
  });

  it('supports optional dueDate', () => {
    const task = createTask({
      title: 'T2',
      description: 'D',
      assignee: 'C',
      priority: 'medium',
      dueDate: '2026-05-01',
    });
    expect(task.dueDate).toBe('2026-05-01');
  });
});

describe('get_analytics', () => {
  it('returns 7d analytics', () => {
    const result = getAnalytics('7d') as Record<string, unknown>;
    expect(result.period).toBe('Last 7 days');
    expect(typeof result.pageViews).toBe('number');
    expect(typeof result.revenue).toBe('number');
  });

  it('returns 30d analytics', () => {
    const result = getAnalytics('30d') as Record<string, unknown>;
    expect(result.period).toBe('Last 30 days');
  });

  it('defaults to 7d for unknown period', () => {
    const result = getAnalytics('unknown') as Record<string, unknown>;
    expect(result.period).toBe('Last 7 days');
  });
});

describe('send_notification', () => {
  it('returns a notification object', () => {
    const result = sendNotification('slack', 'Hello team!') as Record<string, unknown>;
    expect(result.status).toBe('sent');
    expect(result.channel).toBe('slack');
    expect(result.message).toBe('Hello team!');
    expect(result.id).toBeTruthy();
  });

  it('accepts priority', () => {
    const result = sendNotification('email', 'Alert!', 'high') as Record<string, unknown>;
    expect(result.priority).toBe('high');
  });
});

describe('generate_report', () => {
  it('generates a report with required fields', () => {
    const report = generateReport('weekly', '2026-04-01', '2026-04-07') as Record<string, unknown>;
    expect(report.reportId).toBeTruthy();
    expect(report.reportType).toBe('weekly');
    expect(report.summary).toBeDefined();
    expect(report.highlights).toBeInstanceOf(Array);
  });

  it('includes contact count in summary', () => {
    const report = generateReport('monthly', '2026-03-01', '2026-03-31') as {
      summary: { totalContacts: number };
    };
    expect(report.summary.totalContacts).toBe(20);
  });
});
