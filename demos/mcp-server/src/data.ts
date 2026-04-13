export interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  role: string;
  phone: string;
  tags: string[];
  lastContacted: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  dueDate?: string;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@techcorp.com', company: 'TechCorp', role: 'CTO', phone: '+44 7700 900001', tags: ['enterprise', 'ai'], lastContacted: '2026-03-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@startupxyz.io', company: 'StartupXYZ', role: 'CEO', phone: '+44 7700 900002', tags: ['startup', 'saas'], lastContacted: '2026-03-20' },
  { id: 3, name: 'Carol Davis', email: 'carol@agencyplus.co.uk', company: 'AgencyPlus', role: 'Head of Digital', phone: '+44 7700 900003', tags: ['agency', 'marketing'], lastContacted: '2026-04-01' },
  { id: 4, name: 'David Lee', email: 'david@fintech.com', company: 'FinTech Ltd', role: 'VP Engineering', phone: '+44 7700 900004', tags: ['fintech', 'enterprise'], lastContacted: '2026-04-05' },
  { id: 5, name: 'Emma Wilson', email: 'emma@healthai.co', company: 'HealthAI', role: 'Product Manager', phone: '+44 7700 900005', tags: ['healthtech', 'ai'], lastContacted: '2026-03-28' },
  { id: 6, name: 'Frank Brown', email: 'frank@retailco.com', company: 'RetailCo', role: 'COO', phone: '+44 7700 900006', tags: ['retail', 'automation'], lastContacted: '2026-02-14' },
  { id: 7, name: 'Grace Chen', email: 'grace@edutech.io', company: 'EduTech', role: 'Director of Technology', phone: '+44 7700 900007', tags: ['education', 'saas'], lastContacted: '2026-04-10' },
  { id: 8, name: 'Henry Taylor', email: 'henry@logistics.com', company: 'LogisTech', role: 'CIO', phone: '+44 7700 900008', tags: ['logistics', 'automation'], lastContacted: '2026-03-30' },
  { id: 9, name: 'Isabel Martinez', email: 'isabel@designstudio.co', company: 'Design Studio', role: 'Creative Director', phone: '+44 7700 900009', tags: ['design', 'agency'], lastContacted: '2026-04-08' },
  { id: 10, name: 'James Anderson', email: 'james@proptech.co.uk', company: 'PropTech UK', role: 'CEO', phone: '+44 7700 900010', tags: ['proptech', 'startup'], lastContacted: '2026-03-22' },
  { id: 11, name: 'Karen White', email: 'karen@legaltech.com', company: 'LegalTech Corp', role: 'CTO', phone: '+44 7700 900011', tags: ['legaltech', 'enterprise'], lastContacted: '2026-04-11' },
  { id: 12, name: 'Liam O\'Brien', email: 'liam@cybersec.io', company: 'CyberSec Ltd', role: 'CISO', phone: '+44 7700 900012', tags: ['security', 'enterprise'], lastContacted: '2026-04-02' },
  { id: 13, name: 'Mia Thompson', email: 'mia@medtech.co', company: 'MedTech Solutions', role: 'VP Product', phone: '+44 7700 900013', tags: ['medtech', 'ai'], lastContacted: '2026-03-18' },
  { id: 14, name: 'Noah Harris', email: 'noah@greentech.com', company: 'GreenTech', role: 'CEO', phone: '+44 7700 900014', tags: ['cleantech', 'startup'], lastContacted: '2026-04-06' },
  { id: 15, name: 'Olivia Clark', email: 'olivia@ecommerce.co.uk', company: 'eCommerce Hub', role: 'Head of Operations', phone: '+44 7700 900015', tags: ['ecommerce', 'automation'], lastContacted: '2026-03-25' },
  { id: 16, name: 'Peter Robinson', email: 'peter@hrtech.com', company: 'HRTech Inc', role: 'CTO', phone: '+44 7700 900016', tags: ['hrtech', 'saas'], lastContacted: '2026-04-09' },
  { id: 17, name: 'Quinn Lewis', email: 'quinn@adtech.io', company: 'AdTech Platform', role: 'Engineering Lead', phone: '+44 7700 900017', tags: ['adtech', 'ai'], lastContacted: '2026-03-12' },
  { id: 18, name: 'Rachel Walker', email: 'rachel@insurtech.co', company: 'InsurTech', role: 'VP Technology', phone: '+44 7700 900018', tags: ['insurtech', 'enterprise'], lastContacted: '2026-04-03' },
  { id: 19, name: 'Samuel Hall', email: 'samuel@martech.com', company: 'MarTech Co', role: 'CEO', phone: '+44 7700 900019', tags: ['martech', 'automation'], lastContacted: '2026-03-31' },
  { id: 20, name: 'Tessa Young', email: 'tessa@ailab.io', company: 'AI Lab', role: 'Research Director', phone: '+44 7700 900020', tags: ['ai', 'research'], lastContacted: '2026-04-12' },
];

// In-memory task store
export const taskStore: Task[] = [];
