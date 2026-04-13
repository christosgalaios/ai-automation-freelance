import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Christos Galaios — AI Automation Engineer',
  description:
    'I build production MCP servers, multi-agent workflows, and Claude integrations that save businesses 20+ hours/week. Based in Bristol, UK.',
  keywords: [
    'MCP server',
    'Claude integration',
    'AI automation',
    'multi-agent systems',
    'TypeScript',
    'Anthropic',
    'workflow automation',
  ],
  authors: [{ name: 'Christos Galaios' }],
  openGraph: {
    title: 'Christos Galaios — AI Automation Engineer',
    description:
      'Production MCP servers, multi-agent workflows, and Claude integrations that save businesses 20+ hours/week.',
    type: 'website',
    url: 'https://christosgalaios.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christos Galaios — AI Automation Engineer',
    description: 'Production MCP servers, multi-agent workflows, and Claude integrations.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
