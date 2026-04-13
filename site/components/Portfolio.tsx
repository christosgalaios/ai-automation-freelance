'use client';

import { useEffect, useRef } from 'react';

const demos = [
  {
    title: 'Multi-Tool MCP Server',
    description:
      'A production-ready MCP server with 5 tools: CRM search, task creation, analytics, notifications, and report generation. Connects Claude Desktop to real business systems via the official MCP SDK.',
    tags: ['TypeScript', 'MCP SDK', 'Vitest', 'Claude'],
    github:
      'https://github.com/christosgalaios/ai-automation-freelance/tree/main/demos/mcp-server',
    snippet: `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  { name: 'ai-automation-demo', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  switch (name) {
    case 'search_contacts':
      return { content: [{ type: 'text',
        text: JSON.stringify(searchContacts(args.query)) }] };
    case 'create_task':
      return { content: [{ type: 'text',
        text: JSON.stringify(createTask(args)) }] };
    // ... 3 more tools
  }
});`,
  },
  {
    title: 'Content Pipeline Agent',
    description:
      'Drop in a topic, get back 5 platform-specific social posts, a full blog outline, categorised hashtags, and an optimal posting schedule. Zod-validated structured output with retry logic.',
    tags: ['TypeScript', 'Anthropic SDK', 'Zod', 'claude-sonnet-4-6'],
    github:
      'https://github.com/christosgalaios/ai-automation-freelance/tree/main/demos/content-pipeline',
    snippet: `export async function runContentPipeline(
  topic: string,
  client?: Anthropic
): Promise<ContentOutput> {
  const response = await withRetry(() =>
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user',
        content: \`Generate content for: "\${topic}"\` }],
    })
  );
  // Zod validates all output fields
  return ContentOutputSchema.parse(JSON.parse(response.content[0].text));
}`,
  },
  {
    title: 'Workflow Automation Template',
    description:
      'Drop a CSV into a watched directory — it automatically enriches every row with Claude (category, sentiment, priority), outputs a structured JSON report, and sends a Slack notification.',
    tags: ['TypeScript', 'chokidar', 'csv-parse', 'Anthropic SDK', 'Zod'],
    github:
      'https://github.com/christosgalaios/ai-automation-freelance/tree/main/demos/workflow-automation',
    snippet: `watcher.on('add', (filePath: string) => {
  if (extname(filePath) === '.csv') {
    queue.add(filePath);
    void drainQueue();
  }
});

async function processFile(filePath: string) {
  const { rows } = parseCsvFile(filePath);
  const { enriched } = await enrichBatch(rows, client);
  const report = buildReport(filePath, enriched, rows.length, []);
  const outputPath = saveReport(report, outputDir);
  sendSlackNotification(report); // logs to console
}`,
  },
];

export default function Portfolio() {
  const codeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    import('highlight.js').then((hljs) => {
      if (cancelled) return;
      codeRefs.current.forEach((el) => {
        if (el && !el.dataset.highlighted) {
          hljs.default.highlightElement(el);
        }
      });
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-[#111827]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Portfolio
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three production-quality demos — all open source, all with test suites.
          </p>
        </div>

        <div className="space-y-10">
          {demos.map((demo, i) => (
            <div
              key={demo.title}
              className="rounded-xl border border-gray-800 bg-[#0a0e1a] overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                      {demo.description}
                    </p>
                  </div>
                  <a
                    href={demo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 hover:border-brand-600 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    View Code
                  </a>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {demo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-md bg-brand-950 text-brand-300 border border-brand-900 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="rounded-lg overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-gray-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-xs text-gray-500 font-mono">
                      {demo.title.toLowerCase().replace(/\s+/g, '-')}.ts
                    </span>
                  </div>
                  <pre className="overflow-x-auto">
                    <code
                      ref={(el) => { codeRefs.current[i] = el; }}
                      className="language-typescript"
                    >
                      {demo.snippet}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
