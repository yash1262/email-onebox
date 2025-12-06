// This file contains email account configuration for demo purposes
// In production, these would come from the backend API

export const DEMO_EMAIL_ACCOUNTS = [
  {
    email: 'yashjambotkar90@gmail.com',
    name: 'Yash Jambotkar',
    folder: 'INBOX',
    unreadCount: 12
  },
  {
    email: '22u1948@students.git.edu',
    name: 'GIT Student Account',
    folder: 'INBOX',
    unreadCount: 5
  }
];

// Enhanced demo emails based on the configured accounts
export const DEMO_EMAILS_ENHANCED = [
  {
    id: '1',
    messageId: 'demo-1@gmail.com',
    accountEmail: 'yashjambotkar90@gmail.com',
    from: 'noreply@email-onebox.com',
    to: 'yashjambotkar90@gmail.com',
    subject: 'Welcome to Email Onebox - Demo Mode Active',
    body: `Dear Yash,

Welcome to Email Onebox! 

This is a demo email showing that the system is running in demo mode. The backend service is not currently deployed.

To see your real emails:
1. Deploy the backend server
2. Configure Elasticsearch and Qdrant databases
3. Set up environment variables on the deployment platform

Demo Features Enabled:
- Email aggregation UI
- Category filtering
- Search functionality
- AI reply generation (when backend is live)

Your configured email accounts:
- yashjambotkar90@gmail.com
- 22u1948@students.git.edu

Best regards,
Email Onebox Team`,
    date: new Date().toISOString(),
    folder: 'INBOX',
    uid: 1,
    flags: [],
    timestamp: new Date().toISOString(),
    category: 'Interested'
  },
  {
    id: '2',
    messageId: 'demo-2@gmail.com',
    accountEmail: '22u1948@students.git.edu',
    from: 'coordinator@git.edu',
    to: '22u1948@students.git.edu',
    subject: 'Campus Placement Drive - Registration Open',
    body: `Hi Student,

Great to hear you're interested in our upcoming placement drive!

Company: Tech Innovation Ltd
Date: December 15, 2025
Time: 10:00 AM - 4:00 PM
Location: Main Campus Auditorium

Eligibility Criteria:
- CGPA: 7.0+
- No active backlogs
- Final year or recent graduates

To register:
Visit: placements.git.edu/register

Roles Available:
- Software Engineer (15 positions)
- Data Analyst (8 positions)
- Quality Assurance Engineer (5 positions)

Please register before December 10, 2025.

Best regards,
Placement Coordinator`,
    date: new Date(Date.now() - 3600000).toISOString(),
    folder: 'INBOX',
    uid: 2,
    flags: ['\\Starred'],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    category: 'Meeting Booked'
  },
  {
    id: '3',
    messageId: 'demo-3@gmail.com',
    accountEmail: 'yashjambotkar90@gmail.com',
    from: 'hr@softwarecorp.com',
    to: 'yashjambotkar90@gmail.com',
    subject: 'Job Opportunity: Senior Software Engineer',
    body: `Hello Yash,

We're excited to inform you about a wonderful opportunity at Software Corporation.

Position: Senior Software Engineer
Location: Bangalore, India (Remote options available)
Experience: 3-5 years
Salary Range: 20-28 LPA

About the Role:
- Lead backend architecture design
- Mentor junior developers
- Collaborate with cross-functional teams
- Work on scalable microservices

What We're Looking For:
- Strong Python/Node.js experience
- System design knowledge
- Problem-solving mindset
- Team collaboration skills

Next Steps:
If interested, please reply to this email with your updated resume.

Looking forward to hearing from you!

Best regards,
HR Team
Software Corporation`,
    date: new Date(Date.now() - 7200000).toISOString(),
    folder: 'INBOX',
    uid: 3,
    flags: [],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    category: 'Interested'
  }
];
