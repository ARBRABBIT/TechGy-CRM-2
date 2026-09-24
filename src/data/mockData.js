// TechGy Internal CRM Mock Data Store
// Color System: Primary Vibrant Blue #0022FF, Dark Navy #0F1A34 & Off-White #F8F9FA
import { getTodayISO, getPastISO, getFutureISO, getCurrentFiscalYear } from '../utils/dateUtils';

export const INITIAL_OWNERS = [
  'All Owners',
  'Rajesh Sharma',
  'Priya Patel',
  'Amit Verma',
  'Ananya Rao',
  'Vikram Malhotra'
];

export const INITIAL_DATE_FILTERS = [
  'This Month',
  'This Quarter',
  getCurrentFiscalYear(),
  'All Time'
];

export const LEAD_SOURCES = [
  'Website',
  'Inbound Call',
  'Referral',
  'LinkedIn',
  'Campaign',
  'Partner'
];

export const SERVICES_OFFERED = [
  'TechGy CRM Enterprise Suite',
  'Omnichannel Voice & AI Dialer',
  'Field Sales Mobility & Geofencing',
  'Enterprise Data Migration & Onboarding',
  'Custom ERP & WhatsApp Gateway Integration',
  'Cloud Infrastructure & Security Solutions',
  'Dedicated Support & AMC'
];

export const REVENUE_DATA = {
  Monthly: {
    revenue: '₹14,25,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: 'Week 1', revenue: 280000, target: 300000 },
      { period: 'Week 2', revenue: 350000, target: 320000 },
      { period: 'Week 3', revenue: 415000, target: 350000 },
      { period: 'Week 4', revenue: 380000, target: 360000 },
    ]
  },
  Quarterly: {
    revenue: '₹48,50,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: 'Month 1', revenue: 1425000, target: 1500000 },
      { period: 'Month 2', revenue: 1680000, target: 1600000 },
      { period: 'Month 3', revenue: 1745000, target: 1700000 },
    ]
  },
  FY: {
    revenue: '₹1,82,00,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: 'Q1', revenue: 4200000, target: 4000000 },
      { period: 'Q2', revenue: 4850000, target: 4500000 },
      { period: 'Q3', revenue: 5100000, target: 5000000 },
      { period: 'Q4', revenue: 4050000, target: 4500000 },
    ]
  },
  FY26: {
    revenue: '₹1,82,00,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: 'Q1', revenue: 4200000, target: 4000000 },
      { period: 'Q2', revenue: 4850000, target: 4500000 },
      { period: 'Q3', revenue: 5100000, target: 5000000 },
      { period: 'Q4', revenue: 4050000, target: 4500000 },
    ]
  },
  AllTime: {
    revenue: '₹5,40,00,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: 'FY24', revenue: 14500000, target: 14000000 },
      { period: 'FY25', revenue: 21300000, target: 20000000 },
      { period: 'FY26', revenue: 18200000, target: 18000000 },
    ]
  }
};

export const SOURCE_MIX_DATA = [
  { name: 'Website', count: 48, percentage: 37.5, color: '#0022FF' },
  { name: 'Referral', count: 32, percentage: 25.0, color: '#254BFF' },
  { name: 'LinkedIn', count: 24, percentage: 18.75, color: '#4D6DFF' },
  { name: 'Inbound Call', count: 12, percentage: 9.38, color: '#708BFF' },
  { name: 'Campaign', count: 8, percentage: 6.25, color: '#99ACFF' },
  { name: 'Partner', count: 4, percentage: 3.12, color: '#C2CDFF' }
];

export const INITIAL_ACCOUNTS = [
  {
    id: 'ACC-101',
    companyName: 'Tata Consultancy Tech Ltd',
    industry: 'Enterprise Software',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    companySize: '500-1000 employees',
    website: 'www.tatatech.co.in',
    location: 'Mumbai, MH',
    accountOwner: 'Rajesh Sharma',
    estimatedAccountValue: '₹1,80,00,000',
    leadsCount: 3,
    contactsCount: 4,
    createdDate: '2026-08-15'
  },
  {
    id: 'ACC-102',
    companyName: 'Reliance Cloud Solutions',
    industry: 'Cloud Infrastructure',
    serviceProviding: 'Enterprise Data Migration & Onboarding',
    companySize: '1000+ employees',
    website: 'www.reliancecloud.in',
    location: 'Bengaluru, KA',
    accountOwner: 'Priya Patel',
    estimatedAccountValue: '₹3,20,00,000',
    leadsCount: 2,
    contactsCount: 3,
    createdDate: '2026-08-18'
  },
  {
    id: 'ACC-103',
    companyName: 'Infosys Digital Systems',
    industry: 'Healthcare IT',
    serviceProviding: 'Omnichannel Voice & AI Dialer',
    companySize: '250-500 employees',
    website: 'www.infosysdigital.co.in',
    location: 'Hyderabad, TS',
    accountOwner: 'Amit Verma',
    estimatedAccountValue: '₹1,40,00,000',
    leadsCount: 4,
    contactsCount: 5,
    createdDate: '2026-08-20'
  },
  {
    id: 'ACC-104',
    companyName: 'HDFC Fintech Dynamics',
    industry: 'Financial Services',
    serviceProviding: 'Custom ERP & WhatsApp Gateway Integration',
    companySize: '100-250 employees',
    website: 'www.hdfcfintech.in',
    location: 'Delhi NCR',
    accountOwner: 'Ananya Rao',
    estimatedAccountValue: '₹95,00,000',
    leadsCount: 2,
    contactsCount: 2,
    createdDate: '2026-08-22'
  },
  {
    id: 'ACC-105',
    companyName: 'Mahindra Supply Chain Logistics',
    industry: 'Supply Chain',
    serviceProviding: 'Field Sales Mobility & Geofencing',
    companySize: '50-100 employees',
    website: 'www.mahindralogistics.co.in',
    location: 'Pune, MH',
    accountOwner: 'Vikram Malhotra',
    estimatedAccountValue: '₹75,00,000',
    leadsCount: 1,
    contactsCount: 2,
    createdDate: '2026-08-25'
  },
  {
    id: 'ACC-106',
    companyName: 'GreenGrid Energy Pvt Ltd',
    industry: 'Renewable Energy & CleanTech',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    companySize: '250-500 employees',
    website: 'www.greengridenergy.in',
    location: 'Ahmedabad, GJ',
    accountOwner: 'Rahul Verma',
    estimatedAccountValue: '₹1,50,00,000',
    leadsCount: 1,
    contactsCount: 2,
    createdDate: '2026-08-15'
  },
  {
    id: 'ACC-107',
    companyName: 'Apex Technologies Ltd',
    industry: 'Cloud Infrastructure & DevOps',
    serviceProviding: 'Cloud Infrastructure & Security Solutions',
    companySize: '500-1000 employees',
    website: 'www.apextech.co.in',
    location: 'Bengaluru, KA',
    accountOwner: 'Priya Sharma',
    estimatedAccountValue: '₹2,10,00,000',
    leadsCount: 1,
    contactsCount: 2,
    createdDate: '2026-08-20'
  },
  {
    id: 'ACC-108',
    companyName: 'Nexus Retails India',
    industry: 'Retail & Consumer Goods',
    serviceProviding: 'Omnichannel Voice & AI Dialer',
    companySize: '1000+ employees',
    website: 'www.nexusretails.in',
    location: 'Gurugram, HR',
    accountOwner: 'Rahul Verma',
    estimatedAccountValue: '₹1,25,00,000',
    leadsCount: 1,
    contactsCount: 3,
    createdDate: '2026-08-22'
  }
];

export const INITIAL_LEADS = [
  {
    id: '#PG26080008',
    leadName: 'Tharun Duggi',
    phoneNumber: '6303655909',
    emailId: 'hahsh@gmail.com',
    company: 'Duggi Enterprises Pvt Ltd',
    designation: 'Managing Director',
    dob: '13 Mar 2001',
    income: '₹13,00,000',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'N/A',
    enquiries: 3,
    leadSource: 'WHATSAPP',
    status: 'SITE REVISIT',
    salesHead: 'Rajesh Sharma',
    salesExecutive: null, // Unassigned in Sales Head queue!
    leadOwner: 'Rajesh Sharma',
    priority: 'High',
    createdDate: '16 Aug 2026',
    creationDate: '16 Aug 2026',
    lastActivity: 'Site visit requested via WhatsApp',
    nextFollowup: `${getTodayISO()} 15:30`,
    dueToday: true,
    isOverdue: false,
    notes: 'Requested re-visit with family on weekend. Budget approved.',
    nextAction: 'Assign executive to arrange dedicated vehicle for site visit'
  },
  {
    id: '#RE26090001',
    leadName: 'Balaji Yadav',
    phoneNumber: '9030865751',
    emailId: 'balaji.yadav@gmail.com',
    company: 'Reliance Commercial Group',
    designation: 'Senior Director',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Reliance Elysium',
    enquiries: 1,
    leadSource: 'WHATSAPP',
    status: 'NEW LEADS',
    salesHead: 'VR vishnu rm',
    salesExecutive: null, // Unassigned
    leadOwner: 'VR vishnu rm',
    priority: 'High',
    createdDate: '24 Sept 2026',
    creationDate: '24 Sept 2026',
    lastActivity: 'Inquiry via WhatsApp Business',
    nextFollowup: `${getTodayISO()} 12:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Interested in premium corner duplex villa at Reliance Elysium.',
    nextAction: 'Assign to Sales Executive for first contact'
  },
  {
    id: '#FN26090046',
    leadName: 'vijay',
    phoneNumber: '9846985236',
    emailId: 'tattofarm@gmail.com',
    company: 'Farm Natura Agro Tech',
    designation: 'Proprietor',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Rahul Verma', // Assigned
    leadOwner: 'Rahul Verma',
    priority: 'Medium',
    createdDate: '24 Sept 2026',
    creationDate: '24 Sept 2026',
    lastActivity: 'Meta lead ad conversion',
    nextFollowup: `${getTodayISO()} 14:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Inquiry for 2-acre managed farmland unit.',
    nextAction: 'Send brochure and schedule intro call'
  },
  {
    id: '#FN26090045',
    leadName: 'Sam',
    phoneNumber: '9937071517',
    emailId: 'sevendreamsglobalconsulting@gmail.com',
    company: 'Seven Dreams Global Consulting',
    designation: 'Managing Partner',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Rahul Verma', // Assigned
    leadOwner: 'Rahul Verma',
    priority: 'High',
    createdDate: '24 Sept 2026',
    creationDate: '24 Sept 2026',
    lastActivity: 'Downloaded project deck',
    nextFollowup: `${getTodayISO()} 16:30`,
    dueToday: true,
    isOverdue: false,
    notes: 'Looking for luxury farm plot investment portfolio.',
    nextAction: 'Share site layout and pricing sheet'
  },
  {
    id: '#FN26090044',
    leadName: 'Y C Choudary',
    phoneNumber: '9848175044',
    emailId: 'choudary1111@gmail.com',
    company: 'Choudary Infrastructure',
    designation: 'Director',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Sneha Rao', // Assigned
    leadOwner: 'Sneha Rao',
    priority: 'Medium',
    createdDate: '21 Sept 2026',
    creationDate: '21 Sept 2026',
    lastActivity: 'Meta ad lead form submission',
    nextFollowup: `${getTodayISO()} 11:30`,
    dueToday: true,
    isOverdue: false,
    notes: 'Requested call back in morning.',
    nextAction: 'Follow up on inquiry'
  },
  {
    id: '#FN26090043',
    leadName: 'Ram',
    phoneNumber: '7259813154',
    emailId: 'krishna13n@gmail.com',
    company: 'Krishna Tech Corp',
    designation: 'Tech Lead',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Sneha Rao', // Assigned
    leadOwner: 'Sneha Rao',
    priority: 'Low',
    createdDate: '20 Sept 2026',
    creationDate: '20 Sept 2026',
    lastActivity: 'Initial inquiry logged',
    nextFollowup: `${getPastISO(1)} 15:00`,
    dueToday: false,
    isOverdue: true,
    notes: 'Interested in farmland club membership options.',
    nextAction: 'Send project walk-through video'
  },
  {
    id: '#FN26090042',
    leadName: 'Gopinath Mahankali',
    phoneNumber: '9900066297',
    emailId: 'gopi.ipm@gmail.com',
    company: 'IPM Solutions India',
    designation: 'General Manager',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Arjun Kapoor', // Assigned
    leadOwner: 'Arjun Kapoor',
    priority: 'High',
    createdDate: '19 Sept 2026',
    creationDate: '19 Sept 2026',
    lastActivity: 'Inquiry received',
    nextFollowup: `${getTodayISO()} 17:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'High net-worth lead looking for organic farm retreat.',
    nextAction: 'Schedule virtual consultation'
  },
  {
    id: '#FN26090041',
    leadName: 'Varun p',
    phoneNumber: '9032322176',
    emailId: 'ptvarun@gmail.com',
    company: 'Varun Logistics Group',
    designation: 'Co-Founder',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Arjun Kapoor', // Assigned
    leadOwner: 'Arjun Kapoor',
    priority: 'Medium',
    createdDate: '19 Sept 2026',
    creationDate: '19 Sept 2026',
    lastActivity: 'Email sent',
    nextFollowup: `${getTodayISO()} 16:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Interested in phase 2 plots.',
    nextAction: 'Follow up on payment plan'
  },
  {
    id: '#FN26090040',
    leadName: 'Rishabh',
    phoneNumber: '8467910118',
    emailId: 'therootinquiry@gmail.com',
    company: 'Root Tech Innovations',
    designation: 'Director',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 1,
    leadSource: 'META',
    status: 'NEW LEADS',
    salesHead: 'RM01 FN',
    salesExecutive: 'Meera Iyer', // Assigned
    leadOwner: 'Meera Iyer',
    priority: 'Medium',
    createdDate: '19 Sept 2026',
    creationDate: '19 Sept 2026',
    lastActivity: 'Brochure sent',
    nextFollowup: `${getTodayISO()} 18:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Reviewing pricing documentation.',
    nextAction: 'Call for feedback'
  },
  {
    id: '#LD-201',
    leadName: 'Aarav Sharma',
    phoneNumber: '+91 98765 43210',
    emailId: 'aarav.sharma@tatatech.co.in',
    company: 'Tata Consultancy Tech Ltd',
    designation: 'VP of Technology',
    dob: '15 Jan 1988',
    income: '₹45,00,000',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'TechGy CRM Enterprise Suite',
    enquiries: 2,
    leadSource: 'WEBSITE',
    status: 'QUALIFIED',
    salesHead: 'Rajesh Sharma',
    salesExecutive: 'Rahul Verma',
    leadOwner: 'Rahul Verma',
    priority: 'High',
    createdDate: getPastISO(2),
    creationDate: '22 Sept 2026',
    lastActivity: 'Call completed, discussed CRM migration',
    nextFollowup: `${getTodayISO()} 15:30`,
    dueToday: true,
    isOverdue: false,
    notes: 'Looking to transition from legacy CRM to unified solution by Q4. Budget approved.',
    nextAction: 'Schedule technical demo call with solution engineering team'
  },
  {
    id: '#LD-202',
    leadName: 'Ananya Patel',
    phoneNumber: '+91 98123 45678',
    emailId: 'ananya.patel@reliancecloud.in',
    company: 'Reliance Cloud Solutions',
    designation: 'Director of Procurement',
    dob: '22 Jul 1990',
    income: '₹38,00,000',
    serviceProviding: 'Enterprise Data Migration & Onboarding',
    project: 'Reliance Elysium',
    enquiries: 4,
    leadSource: 'REFERRAL',
    status: 'DISCUSSION',
    salesHead: 'Priya Patel',
    salesExecutive: 'Sneha Rao',
    leadOwner: 'Sneha Rao',
    priority: 'High',
    createdDate: getPastISO(5),
    creationDate: '19 Sept 2026',
    lastActivity: 'Proposal sent, pending executive review',
    nextFollowup: `${getPastISO(2)} 11:00`,
    dueToday: false,
    isOverdue: true,
    notes: 'Referred by executive board member. Requires custom SLA terms in proposal.',
    nextAction: 'Send revised commercial terms document and follow up on procurement timeline'
  },
  {
    id: '#JK-301',
    leadName: 'Test Bot 001',
    phoneNumber: '0000000000',
    emailId: 'bot@spam.com',
    company: 'Spam Auto Corp',
    designation: 'N/A',
    dob: '--',
    income: '--',
    serviceProviding: 'TechGy CRM Enterprise Suite',
    project: 'Farm Natura',
    enquiries: 0,
    leadSource: 'META',
    status: 'JUNK',
    salesHead: 'RM01 FN',
    salesExecutive: null,
    leadOwner: 'RM01 FN',
    isJunk: true,
    junkReason: 'Invalid Phone Number / Automated Spam Entry',
    priority: 'Low',
    createdDate: '15 Sept 2026',
    creationDate: '15 Sept 2026',
    lastActivity: 'Marked as Junk by system audit',
    notes: 'Automated fake lead submission from Facebook ad test.'
  }
];



export const INITIAL_ACTIVITIES = [
  {
    id: 'ACT-501',
    type: 'Call',
    date: `${getTodayISO()} 10:30 AM`,
    duration: '25 mins',
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Aarav Sharma',
    outcome: 'Connected - Positive',
    notes: 'Reviewed technical requirements for API integrations. Aarav requested formal proposal update.',
    status: 'Completed',
    isOverdue: false
  },
  {
    id: 'ACT-502',
    type: 'Follow-up',
    date: `${getTodayISO()} 11:00 AM`,
    dueTime: `${getTodayISO()} 11:00`,
    owner: 'Priya Patel',
    company: 'Reliance Cloud Solutions',
    lead: 'Ananya Patel',
    priority: 'High',
    status: 'Pending',
    reminder: '15 mins before',
    notes: 'Follow up on procurement SLA terms document sent last Friday.',
    isOverdue: false,
    dueToday: true
  },
  {
    id: 'ACT-503',
    type: 'Email',
    date: `${getPastISO(1)} 09:15 AM`,
    subject: 'Security Whitepaper & Compliance Specs',
    owner: 'Amit Verma',
    company: 'Infosys Digital Systems',
    lead: 'Rohan Verma',
    summary: 'Sent complete security compliance certification documents and data encryption standards.',
    status: 'Sent',
    isOverdue: false
  },
  {
    id: 'ACT-504',
    type: 'SMS / WhatsApp',
    date: `${getPastISO(2)} 02:00 PM`,
    owner: 'Ananya Rao',
    company: 'HDFC Fintech Dynamics',
    lead: 'Pooja Iyer',
    status: 'Delivered',
    shortPreview: 'Hi Pooja, let me know if you received the updated proposal PR-404 for CFO review.',
    isOverdue: true
  },
  {
    id: 'ACT-505',
    type: 'Meeting',
    date: `${getTodayISO()} 02:00 PM`,
    attendees: 'Priya Patel, Aditya Joshi, CFO Team',
    owner: 'Priya Patel',
    company: 'Reliance Cloud Solutions',
    lead: 'Aditya Joshi',
    meetingNotes: 'Review multi-year license volume discount terms and SLA guarantees.',
    nextAction: 'Issue finalized contract for digital signature',
    status: 'Scheduled',
    isOverdue: false
  },
  {
    id: 'ACT-506',
    type: 'Follow-up',
    date: `${getPastISO(3)} 10:00 AM`,
    dueTime: `${getPastISO(3)} 10:00`,
    owner: 'Vikram Malhotra',
    company: 'Mahindra Supply Chain Logistics',
    lead: 'Karan Mehta',
    priority: 'Low',
    status: 'Pending',
    reminder: '1 hour before',
    notes: 'Check if Karan reviewed whitepaper and wants a 15-min discovery chat.',
    isOverdue: true
  },
  {
    id: 'ACT-507',
    type: 'Follow-up',
    date: `${getTodayISO()} 15:30`,
    dueTime: `${getTodayISO()} 15:30`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Aarav Sharma',
    subject: 'Architecture Demo & Technical Q&A',
    priority: 'High',
    status: 'Scheduled',
    notes: 'Conduct 45-min architecture walkthrough with Aarav and solution architects.',
    isOverdue: false,
    dueToday: true
  },
  {
    id: 'ACT-508',
    type: 'Email',
    date: `${getPastISO(1)} 11:45 AM`,
    subject: 'Enterprise CRM Migration Scope & Pricing Matrix',
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Aarav Sharma',
    summary: 'Delivered initial architectural scope document, pricing matrix, and SLA tiers.',
    notes: 'Email delivered with PDF attachments (Architecture_Blueprint_v1.pdf, Licensing_Tiers.pdf).',
    status: 'Delivered',
    isOverdue: false
  },
  {
    id: 'ACT-509',
    type: 'SMS / WhatsApp',
    date: `${getTodayISO()} 09:15 AM`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Aarav Sharma',
    subject: 'Demo Confirmation via WhatsApp',
    shortPreview: 'Hi Aarav, confirming our 3:30 PM session today with the engineering leads. Looking forward!',
    notes: 'Confirmed calendar invite and sent direct Google Meet join link.',
    status: 'Delivered',
    isOverdue: false
  },
  {
    id: 'ACT-510',
    type: 'Enquiry',
    date: `${getPastISO(2)} 02:10 PM`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Aarav Sharma',
    subject: 'Enterprise Inbound Web Enquiry #ENQ-901',
    notes: 'Submitted website request: "Looking to replace legacy on-prem CRM with modern cloud CRM for 250+ enterprise users by Q4."',
    status: 'Qualified',
    isOverdue: false
  },
  {
    id: 'ACT-511',
    type: 'Call',
    date: `${getTodayISO()} 11:15 AM`,
    duration: '18 mins',
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Sneha Kulkarni',
    subject: 'Sales Ops Automation Discovery Call',
    outcome: 'Connected - Qualified',
    notes: 'Discussed lead routing bottlenecks and territory assignment automation. Sneha approved scheduling a follow-up.',
    status: 'Completed',
    isOverdue: false
  },
  {
    id: 'ACT-512',
    type: 'SMS / WhatsApp',
    date: `${getTodayISO()} 12:40 PM`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Sneha Kulkarni',
    subject: 'Product Brochure Shared via WhatsApp',
    shortPreview: 'Hi Sneha, here is the link to our automated routing workflow overview: https://techgy.in/workflow',
    notes: 'Message delivered and read. Sneha responded with a thumbs up.',
    status: 'Delivered',
    isOverdue: false
  },
  {
    id: 'ACT-513',
    type: 'Enquiry',
    date: `${getPastISO(1)} 10:00 AM`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Sneha Kulkarni',
    subject: 'Web Portal Inquiry #ENQ-902',
    notes: 'Submitted inbound query regarding sales ops automation and automated pipeline health metrics.',
    status: 'In Progress',
    isOverdue: false
  },
  {
    id: 'ACT-514',
    type: 'Follow-up',
    date: `${getTodayISO()} 17:00`,
    dueTime: `${getTodayISO()} 17:00`,
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Sneha Kulkarni',
    subject: 'Review Budget Approval Status',
    priority: 'Medium',
    status: 'Pending',
    notes: 'Check if sales ops budget has been cleared by financial operations committee.',
    isOverdue: false,
    dueToday: true
  },
  {
    id: 'ACT-515',
    type: 'Email',
    date: `${getPastISO(1)} 04:30 PM`,
    subject: 'Platform Integration Capabilities & Case Studies',
    owner: 'Rajesh Sharma',
    company: 'Tata Consultancy Tech Ltd',
    lead: 'Sneha Kulkarni',
    summary: 'Sent detailed capabilities matrix and enterprise customer success case studies.',
    notes: 'Email viewed 3 times by recipient.',
    status: 'Sent',
    isOverdue: false
  }
];



export const INITIAL_CONTACTS = [
  {
    id: 'CON-601',
    name: 'Aarav Sharma',
    company: 'Tata Consultancy Tech Ltd',
    designation: 'VP of Technology',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@tatatech.co.in',
    location: 'Mumbai, MH',
    leadSource: 'Website',
    owner: 'Rajesh Sharma',
    relationshipStatus: 'Active Decision Maker',
    lastContacted: '2026-08-28'
  },
  {
    id: 'CON-602',
    name: 'Ananya Patel',
    company: 'Reliance Cloud Solutions',
    designation: 'Director of Procurement',
    phone: '+91 98123 45678',
    email: 'ananya.patel@reliancecloud.in',
    location: 'Bengaluru, KA',
    leadSource: 'Referral',
    owner: 'Priya Patel',
    relationshipStatus: 'Key Evaluator',
    lastContacted: '2026-08-25'
  },
  {
    id: 'CON-603',
    name: 'Rohan Verma',
    company: 'Infosys Digital Systems',
    designation: 'Chief Technology Officer',
    phone: '+91 97654 32109',
    email: 'rohan.verma@infosysdigital.co.in',
    location: 'Hyderabad, TS',
    leadSource: 'Inbound Call',
    owner: 'Amit Verma',
    relationshipStatus: 'Executive Sponsor',
    lastContacted: '2026-08-28'
  },
  {
    id: 'CON-604',
    name: 'Pooja Iyer',
    company: 'HDFC Fintech Dynamics',
    designation: 'Head of Operations',
    phone: '+91 96543 21098',
    email: 'pooja.iyer@hdfcfintech.in',
    location: 'Delhi NCR',
    leadSource: 'LinkedIn',
    owner: 'Ananya Rao',
    relationshipStatus: 'Operational Lead',
    lastContacted: '2026-08-22'
  },
  {
    id: 'CON-605',
    name: 'Karan Mehta',
    company: 'Mahindra Supply Chain Logistics',
    designation: 'IT Director',
    phone: '+91 95432 10987',
    email: 'karan.mehta@mahindralogistics.co.in',
    location: 'Pune, MH',
    leadSource: 'Campaign',
    owner: 'Vikram Malhotra',
    relationshipStatus: 'No Activity',
    lastContacted: 'None'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    title: 'Follow-up Overdue',
    message: 'Follow-up call with Vikram Malhotra (Tata Consultancy Tech Ltd) is 2 days overdue.',
    timestamp: '10 mins ago',
    category: 'Overdue',
    isRead: false,
    priority: 'High',
    targetModule: 'leads'
  },

  {
    id: 'NOTIF-6',
    title: 'New Contact Added',
    message: 'Siddharth Varma added as Key Decision Maker for Bharti Cloud Ltd.',
    timestamp: 'Yesterday',
    category: 'Contact',
    isRead: false,
    priority: 'Normal',
    targetModule: 'contacts'
  },
  {
    id: 'NOTIF-7',
    title: 'Inbound Web Inquiry',
    message: 'Aarav Mehta submitted a high-value inquiry from Website landing page.',
    timestamp: 'Yesterday',
    category: 'Lead',
    isRead: false,
    priority: 'Normal',
    targetModule: 'leads'
  }
];

export const INITIAL_EMAIL_TEMPLATES = [
  {
    id: 'TPL-001',
    name: 'Introduction & Capabilities Overview',
    category: 'Sales Outreach',
    subject: 'Introduction: TechGy Enterprise CRM Overview for {company}',
    body: `Hi {leadName},\n\nThank you for connecting with TechGy. We specialize in modern enterprise CRM solutions designed to streamline sales workflows, accelerate lead conversions, and centralize omnichannel interactions.\n\nI've attached our capabilities overview and solution brochure for your review. Would you be open for a brief 15-minute introductory call this week to explore how we can support {company}?\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
  },
  {
    id: 'TPL-002',
    name: 'Meeting Follow-up & Commercials',
    category: 'Follow-up',
    subject: 'Follow-up: TechGy CRM Solution Overview & Commercials',
    body: `Hi {leadName},\n\nThank you for your time during our discussion today regarding {company}'s requirements.\n\nAs discussed, I have outlined our proposed solution architecture and commercial terms. Please find the detailed summary and next milestones attached.\n\nLooking forward to hearing your thoughts.\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
  },
  {
    id: 'TPL-003',
    name: 'Interactive Product Demo Invitation',
    category: 'Demo & Pitch',
    subject: 'Interactive Demo Invitation: TechGy CRM for {company}',
    body: `Hi {leadName},\n\nFollowing up on our conversation, I would like to invite you and your team to an interactive walkthrough of the TechGy CRM platform tailored to {company}.\n\nDuring this session, we will demonstrate key capabilities including pipeline automation, activity logging, and intelligent reporting.\n\nPlease let me know a convenient time slot that works best for your schedule.\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
  },
  {
    id: 'TPL-004',
    name: 'Proposal & Scope Review',
    category: 'Commercials',
    subject: 'TechGy CRM Proposal Review & Next Steps for {company}',
    body: `Hi {leadName},\n\nI hope you are having a productive week.\n\nI wanted to follow up on the commercial proposal shared for {company}. Please let me know if your team had a chance to review the scope or if you would like us to clarify any specific details.\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
  },
  {
    id: 'TPL-005',
    name: 'Pipeline Check-in / Re-engagement',
    category: 'Lead Nurture',
    subject: 'Checking in: Sales Workflow Optimization at {company}',
    body: `Hi {leadName},\n\nI wanted to quickly check in and see how your sales automation initiatives are progressing at {company}.\n\nWe recently introduced several enhancements to our platform that could bring immediate value to your sales pipeline.\n\nWould you be open for a quick catch-up this week?\n\nBest regards,\nRajesh Sharma\nTechGy Solutions`
  }
];

// ==========================================
// SALES HEAD & REGIONAL MANAGER MOCK DATA (TECHGY CRM)
// ==========================================

export const SALES_HEAD_PROJECTS = [
  'All Solutions',
  'TechGy CRM Enterprise Suite',
  'Omnichannel Voice & AI Dialer',
  'Field Sales Mobility & Geofencing',
  'Enterprise ERP & Custom Integrations',
  'Cloud Infrastructure & Security'
];

export const INITIAL_SALES_HEADS = [
  {
    id: 'SH-001',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    name: 'Rajesh Sharma',
    role: 'VP & Enterprise Sales Head',
    initials: 'RS',
    avatarBg: '#E0F2FE',
    avatarColor: '#0369A1',
    phone: '9876543210',
    formattedPhone: '+91 98765 43210',
    email: 'rajesh.s@techgy.com',
    project: 'TechGy CRM Enterprise Suite',
    creationDate: '15-01-2026',
    assignedSalesExecutivesCount: 4,
    assignedExecutives: [
      { id: 'EXE-101', name: 'Rahul Verma', role: 'Senior Enterprise Executive', phone: '+91 98765 11001', email: 'rahul.v@techgy.com', leads: 28, demos: 18, convRate: '28%' },
      { id: 'EXE-102', name: 'Sneha Kulkarni', role: 'Solutions Specialist', phone: '+91 98765 11002', email: 'sneha.k@techgy.com', leads: 22, demos: 14, convRate: '24%' },
      { id: 'EXE-103', name: 'Vikrant Joshi', role: 'Account Executive', phone: '+91 98765 11003', email: 'vikrant.j@techgy.com', leads: 18, demos: 10, convRate: '20%' },
      { id: 'EXE-104', name: 'Rohan Mehta', role: 'Associate Executive', phone: '+91 98765 11004', email: 'rohan.m@techgy.com', leads: 15, demos: 8, convRate: '18%' }
    ]
  },
  {
    id: 'SH-002',
    firstName: 'Priya',
    lastName: 'Patel',
    name: 'Priya Patel',
    role: 'Director & Cloud Solutions Head',
    initials: 'PP',
    avatarBg: '#FFE4E6',
    avatarColor: '#E11D48',
    phone: '9812345678',
    formattedPhone: '+91 98123 45678',
    email: 'priya.p@techgy.com',
    project: 'Cloud Infrastructure & Security',
    creationDate: '01-02-2026',
    assignedSalesExecutivesCount: 3,
    assignedExecutives: [
      { id: 'EXE-201', name: 'Sneha Rao', role: 'Key Account Executive', phone: '+91 98123 45671', email: 'sneha.r@techgy.com', leads: 24, demos: 15, convRate: '25%' },
      { id: 'EXE-202', name: 'Aditya Joshi', role: 'Cloud Solutions Consultant', phone: '+91 98123 45672', email: 'aditya.j@techgy.com', leads: 21, demos: 13, convRate: '22%' },
      { id: 'EXE-203', name: 'Deepak Nair', role: 'DevOps & Migration Lead', phone: '+91 98123 45673', email: 'deepak.n@techgy.com', leads: 17, demos: 9, convRate: '19%' }
    ]
  },
  {
    id: 'SH-003',
    firstName: 'Amit',
    lastName: 'Verma',
    name: 'Amit Verma',
    role: 'Enterprise Solutions Head - South',
    initials: 'AV',
    avatarBg: '#DCFCE7',
    avatarColor: '#15803D',
    phone: '9765432109',
    formattedPhone: '+91 97654 32109',
    email: 'amit.v@techgy.com',
    project: 'Omnichannel Voice & AI Dialer',
    creationDate: '15-02-2026',
    assignedSalesExecutivesCount: 3,
    assignedExecutives: [
      { id: 'EXE-301', name: 'Rohan Verma', role: 'Voice Tech Consultant', phone: '+91 97654 32101', email: 'rohan.v@techgy.com', leads: 20, demos: 12, convRate: '21%' },
      { id: 'EXE-302', name: 'Kavita Pandey', role: 'AI Integration Executive', phone: '+91 97654 32102', email: 'kavita.p@techgy.com', leads: 16, demos: 9, convRate: '18%' },
      { id: 'EXE-303', name: 'Sanjay Gupta', role: 'Inside Sales Executive', phone: '+91 97654 32103', email: 'sanjay.g@techgy.com', leads: 12, demos: 6, convRate: '15%' }
    ]
  },
  {
    id: 'SH-004',
    firstName: 'Ananya',
    lastName: 'Rao',
    name: 'Ananya Rao',
    role: 'Sales Head - BFSI & Fintech',
    initials: 'AR',
    avatarBg: '#FCE7F3',
    avatarColor: '#BE185D',
    phone: '9654321098',
    formattedPhone: '+91 96543 21098',
    email: 'ananya.r@techgy.com',
    project: 'Enterprise ERP & Custom Integrations',
    creationDate: '20-02-2026',
    assignedSalesExecutivesCount: 2,
    assignedExecutives: [
      { id: 'EXE-401', name: 'Pooja Iyer', role: 'Fintech Solutions Lead', phone: '+91 96543 21091', email: 'pooja.i@techgy.com', leads: 22, demos: 14, convRate: '23%' },
      { id: 'EXE-402', name: 'Sunita Rao', role: 'Enterprise Account Executive', phone: '+91 96543 21092', email: 'sunita.r@techgy.com', leads: 18, demos: 11, convRate: '20%' }
    ]
  },
  {
    id: 'SH-005',
    firstName: 'Vikram',
    lastName: 'Malhotra',
    name: 'Vikram Malhotra',
    role: 'Regional Sales Head - North',
    initials: 'VM',
    avatarBg: '#FEF3C7',
    avatarColor: '#B45309',
    phone: '9543210987',
    formattedPhone: '+91 95432 10987',
    email: 'vikram.m@techgy.com',
    project: 'Field Sales Mobility & Geofencing',
    creationDate: '01-03-2026',
    assignedSalesExecutivesCount: 2,
    assignedExecutives: [
      { id: 'EXE-501', name: 'Karan Mehta', role: 'Field Mobility Executive', phone: '+91 95432 10981', email: 'karan.m@techgy.com', leads: 16, demos: 9, convRate: '18%' },
      { id: 'EXE-502', name: 'Harpreet Singh', role: 'Logistics Sales Lead', phone: '+91 95432 10982', email: 'harpreet.s@techgy.com', leads: 14, demos: 8, convRate: '16%' }
    ]
  },
  {
    id: 'SH-006',
    firstName: 'Sneha',
    lastName: 'Kulkarni',
    name: 'Sneha Kulkarni',
    role: 'Head of Strategic Accounts',
    initials: 'SK',
    avatarBg: '#CCFBF1',
    avatarColor: '#0F766E',
    phone: '9432109876',
    formattedPhone: '+91 94321 09876',
    email: 'sneha.k@techgy.com',
    project: 'TechGy CRM Enterprise Suite',
    creationDate: '10-03-2026',
    assignedSalesExecutivesCount: 2,
    assignedExecutives: [
      { id: 'EXE-601', name: 'Aarav Mehta', role: 'Corporate Accounts Specialist', phone: '+91 94321 09871', email: 'aarav.m@techgy.com', leads: 19, demos: 12, convRate: '22%' },
      { id: 'EXE-602', name: 'Meenakshi Iyer', role: 'Customer Success Executive', phone: '+91 94321 09872', email: 'meenakshi.i@techgy.com', leads: 15, demos: 9, convRate: '19%' }
    ]
  }
];

export const SALES_HEAD_PERFORMERS = [
  {
    rank: 1,
    id: 'PERF-1',
    code: 'EM01 FN',
    displayName: 'Rahul Verma',
    role: 'Senior Enterprise Sales Executive',
    avatarText: 'RV',
    avatarBg: '#E0F2FE',
    avatarColor: '#0369A1',
    leads: 28,
    followupRate: '94%',
    visits: 18,
    conversionRate: '28%',
    project: 'TechGy CRM Enterprise Suite'
  },
  {
    rank: 2,
    id: 'PERF-2',
    code: 'EM01 RE',
    displayName: 'Sneha Rao',
    role: 'Key Account Executive',
    avatarText: 'SR',
    avatarBg: '#F1F5F9',
    avatarColor: '#334155',
    leads: 24,
    followupRate: '91%',
    visits: 15,
    conversionRate: '25%',
    project: 'Cloud Infrastructure & Security'
  },
  {
    rank: 3,
    id: 'PERF-3',
    code: 'EM02 DC',
    displayName: 'Aditya Joshi',
    role: 'Enterprise Solutions Executive',
    avatarText: 'AJ',
    avatarBg: '#DCFCE7',
    avatarColor: '#166534',
    leads: 21,
    followupRate: '88%',
    visits: 13,
    conversionRate: '22%',
    project: 'Omnichannel Voice & AI Dialer'
  },
  {
    rank: 4,
    id: 'PERF-4',
    code: 'EM03 RE',
    displayName: 'Priya Nair',
    role: 'Senior Account Executive',
    avatarText: 'PN',
    avatarBg: '#FCE7F3',
    avatarColor: '#9D174D',
    leads: 19,
    followupRate: '85%',
    visits: 11,
    conversionRate: '20%',
    project: 'Enterprise ERP & Custom Integrations'
  },
  {
    rank: 5,
    id: 'PERF-5',
    code: 'EM04 TC',
    displayName: 'Karan Mehta',
    role: 'Territory Sales Executive',
    avatarText: 'KM',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    leads: 16,
    followupRate: '82%',
    visits: 9,
    conversionRate: '18%',
    project: 'Field Sales Mobility & Geofencing'
  }
];

export const SALES_HEAD_CALLS_SUMMARY = {
  totalCalls: 148,
  connectedCalls: 112,
  missedCalls: 36,
  connectionRate: '75.7%',
  avgDuration: '14m 30s'
};

export const SALES_HEAD_LEAD_STATUSES = [
  { id: 'st-1', name: 'NEW INBOUND LEADS', count: 1908, percentage: 48, color: '#0022FF' },
  { id: 'st-2', name: 'DISCOVERY CALL COMPLETED', count: 426, percentage: 24, color: '#254BFF' },
  { id: 'st-3', name: 'PRODUCT DEMO SCHEDULED', count: 284, percentage: 14, color: '#0284C7' },
  { id: 'st-4', name: 'PROPOSAL & SLA UNDER REVIEW', count: 142, percentage: 8, color: '#2563EB' },
  { id: 'st-5', name: 'CONTRACT NEGOTIATION', count: 96, percentage: 4, color: '#D97706' },
  { id: 'st-6', name: 'CLOSED - WON & ONBOARDED', count: 64, percentage: 2, color: '#059669' },
  { id: 'st-7', name: 'CLOSED - LOST / POSTPONED', count: 32, percentage: 1, color: '#64748B' }
];

export const SALES_HEAD_QUALITY_DISTRIBUTION = [
  { name: 'Hot Leads', percentage: 72, count: 1374, color: '#EF4444' },
  { name: 'Warm Leads', percentage: 21, count: 401, color: '#F59E0B' },
  { name: 'Cold Leads', percentage: 5, count: 95, color: '#3B82F6' },
  { name: 'Unqualified', percentage: 2, count: 38, color: '#94A3B8' }
];

export const SALES_HEAD_ESCALATIONS = [
  { id: 'ESC-1', leadName: 'Tata Consultancy Tech Ltd', executive: 'Rahul Verma', reason: 'Custom SOC2 & HIPAA compliance SLA sign-off', project: 'TechGy CRM Enterprise Suite', days: 2, priority: 'Critical' },
  { id: 'ESC-2', leadName: 'Reliance Cloud Solutions', executive: 'Sneha Rao', reason: 'High-volume discount tier approval (> 250 seats)', project: 'Cloud Infrastructure & Security', days: 3, priority: 'High' },
  { id: 'ESC-3', leadName: 'Infosys Digital Systems', executive: 'Aditya Joshi', reason: 'Telecom AI dialer latency guarantee clause', project: 'Omnichannel Voice & AI Dialer', days: 1, priority: 'High' },
  { id: 'ESC-4', leadName: 'HDFC Fintech Dynamics', executive: 'Priya Nair', reason: 'Custom ERP webhooks integration timeline clearance', project: 'Enterprise ERP & Custom Integrations', days: 4, priority: 'High' },
  { id: 'ESC-5', leadName: 'Mahindra Logistics Ltd', executive: 'Karan Mehta', reason: 'Field geofencing battery optimization SLA request', project: 'Field Sales Mobility & Geofencing', days: 2, priority: 'Medium' }
];

export const SALES_HEAD_STALE_LEADS = [
  { id: 'STL-1', leadName: 'Sunil Gopinath (Bharti Cloud)', executive: 'Rahul Verma', idleDays: 16, lastContact: '2026-09-08', phone: '+91 98450 12345', project: 'TechGy CRM Enterprise Suite' },
  { id: 'STL-2', leadName: 'Vandana Merchant (Apex Tech)', executive: 'Sneha Rao', idleDays: 18, lastContact: '2026-09-06', phone: '+91 97230 45678', project: 'Cloud Infrastructure & Security' },
  { id: 'STL-3', leadName: 'Rameshwar Vyas (Nexus Retail)', executive: 'Aditya Joshi', idleDays: 22, lastContact: '2026-09-02', phone: '+91 99120 78901', project: 'Omnichannel Voice & AI Dialer' },
  { id: 'STL-4', leadName: 'Harpreet Singh (GreenGrid Energy)', executive: 'Karan Mehta', idleDays: 19, lastContact: '2026-09-05', phone: '+91 96540 23456', project: 'Field Sales Mobility & Geofencing' }
];

export const SALES_HEAD_OBJECTIONS = [
  { title: 'Budget & CapEx Procurement Approval', percentage: 32, color: '#0022FF' },
  { title: 'Legacy CRM & Data Migration Complexity', percentage: 24, color: '#0F1A34' },
  { title: 'Security, Encryption & SOC2 Review', percentage: 18, color: '#0284C7' },
  { title: 'Custom ERP & WhatsApp Gateway Scope', percentage: 14, color: '#059669' },
  { title: 'Multi-Stakeholder Consensus & Timeline', percentage: 12, color: '#D97706' }
];

export const SALES_HEAD_BOOKINGS = [
  { id: 'BKG-1', company: 'Tata Consultancy Tech Ltd', value: '₹1,80,00,000', plan: 'Enterprise CRM Suite (500 Seats)', executive: 'Rahul Verma', date: '2026-09-20', status: 'Signed' },
  { id: 'BKG-2', company: 'Reliance Cloud Solutions', value: '₹3,20,00,000', plan: 'Cloud Infrastructure & Security Suite', executive: 'Sneha Rao', date: '2026-09-18', status: 'Signed' },
  { id: 'BKG-3', company: 'Infosys Digital Systems', value: '₹1,40,00,000', plan: 'Omnichannel AI Dialer Platform', executive: 'Aditya Joshi', date: '2026-09-15', status: 'Active' },
  { id: 'BKG-4', company: 'HDFC Fintech Dynamics', value: '₹95,00,000', plan: 'Custom ERP & WhatsApp Integration', executive: 'Priya Nair', date: '2026-09-12', status: 'Active' }
];

// ==========================================
// SALES EXECUTIVE MOCK DATA (TECHGY CRM)
// ==========================================

export const INITIAL_SALES_EXECUTIVES = [
  {
    id: 'EXE-101',
    firstName: 'Rahul',
    lastName: 'Verma',
    name: 'Rahul Verma',
    role: 'Senior Enterprise Sales Executive',
    initials: 'RV',
    avatarBg: '#E0F2FE',
    avatarColor: '#0369A1',
    phone: '9876511001',
    formattedPhone: '+91 98765 11001',
    email: 'rahul.v@techgy.com',
    project: 'TechGy CRM Enterprise Suite',
    reportingSalesHead: 'Rajesh Sharma',
    creationDate: '15-01-2026',
    assignedLeadsCount: 28,
    missedFollowupsCount: 6,
    avgDelayHours: '3.5 hrs',
    siteVisitsScheduled: 3,
    siteVisitsCompleted: 5,
    totalBookingsUnits: 4,
    totalBookingsValue: '₹1,80,00,000',
    assignedLeads: [
      { id: 'LD-901', name: 'Vikram Malhotra', company: 'Tata Consultancy Tech Ltd', status: 'Proposal Sent', quality: 'Hot', value: '₹45,00,000', nextFollowup: 'Today, 03:00 PM', phone: '+91 98765 43210' },
      { id: 'LD-902', name: 'Sneha Kulkarni', company: 'Tech Mahindra Innovations', status: 'Contract Negotiation', quality: 'Hot', value: '₹35,00,000', nextFollowup: 'Tomorrow, 11:00 AM', phone: '+91 98765 43211' },
      { id: 'LD-903', name: 'Aarav Mehta', company: 'Persistent Systems Ltd', status: 'Product Demo Scheduled', quality: 'Warm', value: '₹28,00,000', nextFollowup: '28 Sep, 02:30 PM', phone: '+91 98765 43212' },
      { id: 'LD-904', name: 'Rohan Deshmukh', company: 'LTI Mindtree Tech', status: 'Discovery Call Completed', quality: 'Warm', value: '₹22,00,000', nextFollowup: '30 Sep, 10:00 AM', phone: '+91 98765 43213' }
    ]
  },
  {
    id: 'EXE-201',
    firstName: 'Sneha',
    lastName: 'Rao',
    name: 'Sneha Rao',
    role: 'Key Account Executive',
    initials: 'SR',
    avatarBg: '#F1F5F9',
    avatarColor: '#334155',
    phone: '9812345671',
    formattedPhone: '+91 98123 45671',
    email: 'sneha.r@techgy.com',
    project: 'Cloud Infrastructure & Security',
    reportingSalesHead: 'Priya Patel',
    creationDate: '01-02-2026',
    assignedLeadsCount: 24,
    missedFollowupsCount: 8,
    avgDelayHours: '5.2 hrs',
    siteVisitsScheduled: 2,
    siteVisitsCompleted: 4,
    totalBookingsUnits: 3,
    totalBookingsValue: '₹3,20,00,000',
    assignedLeads: [
      { id: 'LD-905', name: 'Priya Patel', company: 'Reliance Cloud Solutions', status: 'Contract Negotiation', quality: 'Hot', value: '₹1,20,00,000', nextFollowup: 'Today, 04:30 PM', phone: '+91 98123 45678' },
      { id: 'LD-906', name: 'Sunil Gopinath', company: 'Bharti Cloud Ltd', status: 'Product Demo Scheduled', quality: 'Hot', value: '₹85,00,000', nextFollowup: 'Tomorrow, 03:00 PM', phone: '+91 98123 45679' }
    ]
  },
  {
    id: 'EXE-301',
    firstName: 'Aditya',
    lastName: 'Joshi',
    name: 'Aditya Joshi',
    role: 'Enterprise Solutions Executive',
    initials: 'AJ',
    avatarBg: '#DCFCE7',
    avatarColor: '#166534',
    phone: '9765432101',
    formattedPhone: '+91 97654 32101',
    email: 'aditya.j@techgy.com',
    project: 'Omnichannel Voice & AI Dialer',
    reportingSalesHead: 'Amit Verma',
    creationDate: '15-02-2026',
    assignedLeadsCount: 21,
    missedFollowupsCount: 5,
    avgDelayHours: '2.8 hrs',
    siteVisitsScheduled: 4,
    siteVisitsCompleted: 6,
    totalBookingsUnits: 2,
    totalBookingsValue: '₹1,40,00,000',
    assignedLeads: [
      { id: 'LD-907', name: 'Rohan Verma', company: 'Infosys Digital Systems', status: 'Proposal Sent', quality: 'Hot', value: '₹75,00,000', nextFollowup: 'Today, 02:00 PM', phone: '+91 97654 32109' },
      { id: 'LD-908', name: 'Deepak Nair', company: 'Wipro AI Platforms', status: 'Discovery Call Completed', quality: 'Warm', value: '₹40,00,000', nextFollowup: '29 Sep, 11:30 AM', phone: '+91 97654 32110' }
    ]
  },
  {
    id: 'EXE-401',
    firstName: 'Pooja',
    lastName: 'Iyer',
    name: 'Pooja Iyer',
    role: 'Fintech Solutions Lead',
    initials: 'PI',
    avatarBg: '#FCE7F3',
    avatarColor: '#9D174D',
    phone: '9654321091',
    formattedPhone: '+91 96543 21091',
    email: 'pooja.i@techgy.com',
    project: 'Enterprise ERP & Custom Integrations',
    reportingSalesHead: 'Ananya Rao',
    creationDate: '20-02-2026',
    assignedLeadsCount: 19,
    missedFollowupsCount: 7,
    avgDelayHours: '4.1 hrs',
    siteVisitsScheduled: 1,
    siteVisitsCompleted: 3,
    totalBookingsUnits: 2,
    totalBookingsValue: '₹95,00,000',
    assignedLeads: [
      { id: 'LD-909', name: 'Pooja Iyer', company: 'HDFC Fintech Dynamics', status: 'Contract Negotiation', quality: 'Hot', value: '₹60,00,000', nextFollowup: 'Today, 05:00 PM', phone: '+91 96543 21098' }
    ]
  },
  {
    id: 'EXE-501',
    firstName: 'Karan',
    lastName: 'Mehta',
    name: 'Karan Mehta',
    role: 'Field Mobility Executive',
    initials: 'KM',
    avatarBg: '#FEF3C7',
    avatarColor: '#92400E',
    phone: '9543210981',
    formattedPhone: '+91 95432 10981',
    email: 'karan.m@techgy.com',
    project: 'Field Sales Mobility & Geofencing',
    reportingSalesHead: 'Vikram Malhotra',
    creationDate: '01-03-2026',
    assignedLeadsCount: 16,
    missedFollowupsCount: 4,
    avgDelayHours: '3.0 hrs',
    siteVisitsScheduled: 3,
    siteVisitsCompleted: 5,
    totalBookingsUnits: 1,
    totalBookingsValue: '₹48,00,000',
    assignedLeads: [
      { id: 'LD-910', name: 'Karan Mehta', company: 'Mahindra Supply Chain Logistics', status: 'Product Demo Scheduled', quality: 'Warm', value: '₹48,00,000', nextFollowup: 'Tomorrow, 10:30 AM', phone: '+91 95432 10987' }
    ]
  },
  {
    id: 'EXE-601',
    firstName: 'Meenakshi',
    lastName: 'Iyer',
    name: 'Meenakshi Iyer',
    role: 'Corporate Accounts Specialist',
    initials: 'MI',
    avatarBg: '#CCFBF1',
    avatarColor: '#0F766E',
    phone: '9432109872',
    formattedPhone: '+91 94321 09872',
    email: 'meenakshi.i@techgy.com',
    project: 'TechGy CRM Enterprise Suite',
    reportingSalesHead: 'Sneha Kulkarni',
    creationDate: '10-03-2026',
    assignedLeadsCount: 15,
    missedFollowupsCount: 4,
    avgDelayHours: '2.5 hrs',
    siteVisitsScheduled: 2,
    siteVisitsCompleted: 4,
    totalBookingsUnits: 1,
    totalBookingsValue: '₹35,00,000',
    assignedLeads: [
      { id: 'LD-911', name: 'Suresh Raina', company: 'Godrej Infotech', status: 'Discovery Call Completed', quality: 'Warm', value: '₹35,00,000', nextFollowup: '01 Oct, 02:00 PM', phone: '+91 94321 09873' }
    ]
  }
];

export const SALES_EXECUTIVE_TODAY_FOLLOWUPS = [
  {
    id: 'FUP-101',
    leadName: 'Vikram Malhotra',
    company: 'Tata Consultancy Tech Ltd',
    executive: 'Rahul Verma',
    phone: '+91 98765 43210',
    time: '02:30 PM',
    type: 'Phone Call',
    subject: 'Discuss Enterprise 500-seat discount tier',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: 'FUP-102',
    leadName: 'Sneha Kulkarni',
    company: 'Tech Mahindra Innovations',
    executive: 'Rahul Verma',
    phone: '+91 98765 43211',
    time: '04:15 PM',
    type: 'Product Demo',
    subject: 'Walkthrough of Custom ERP Connectors',
    priority: 'High',
    status: 'Pending'
  },
  {
    id: 'FUP-103',
    leadName: 'Priya Patel',
    company: 'Reliance Cloud Solutions',
    executive: 'Sneha Rao',
    phone: '+91 98123 45678',
    time: '05:00 PM',
    type: 'Commercials',
    subject: 'Final sign-off on SLA and pricing schedule',
    priority: 'Critical',
    status: 'Pending'
  },
  {
    id: 'FUP-104',
    leadName: 'Rohan Verma',
    company: 'Infosys Digital Systems',
    executive: 'Aditya Joshi',
    phone: '+91 97654 32109',
    time: '05:45 PM',
    type: 'Follow-up Call',
    subject: 'Clarify telecom AI latency benchmarks',
    priority: 'Medium',
    status: 'Pending'
  }
];

export const SALES_EXECUTIVE_MISSED_FOLLOWUPS = [
  {
    id: 'MSD-1',
    leadName: 'Sunil Gopinath',
    company: 'Bharti Cloud Ltd',
    executive: 'Rahul Verma',
    phone: '+91 98450 12345',
    overdueTime: '2 days overdue',
    delayHours: 48,
    lastActivity: 'Product Demo on 22 Sep',
    subject: 'Follow-up after executive security review'
  },
  {
    id: 'MSD-2',
    leadName: 'Vandana Merchant',
    company: 'Apex Tech Solutions',
    executive: 'Sneha Rao',
    phone: '+91 97230 45678',
    overdueTime: '3 days overdue',
    delayHours: 72,
    lastActivity: 'Proposal Shared on 21 Sep',
    subject: 'Check contract approval status'
  },
  {
    id: 'MSD-3',
    leadName: 'Rameshwar Vyas',
    company: 'Nexus Retail Technologies',
    executive: 'Aditya Joshi',
    phone: '+91 99120 78901',
    overdueTime: '1 day overdue',
    delayHours: 24,
    lastActivity: 'Discovery Call on 23 Sep',
    subject: 'Send tailored AI dialer deck'
  },
  {
    id: 'MSD-4',
    leadName: 'Harpreet Singh',
    company: 'GreenGrid Logistics',
    executive: 'Karan Mehta',
    phone: '+91 96540 23456',
    overdueTime: '4 days overdue',
    delayHours: 96,
    lastActivity: 'Field Demo on 20 Sep',
    subject: 'Confirm driver smartphone compatibility testing'
  }
];

export const SALES_EXECUTIVE_QUALITY_DISTRIBUTION = [
  { name: 'Total Leads', count: 27, color: '#0022FF', percentage: 100 },
  { name: 'Hot Leads', count: 22, color: '#EF4444', percentage: 81.5 },
  { name: 'Warm Leads', count: 5, color: '#3B82F6', percentage: 18.5 },
  { name: 'Cold Leads', count: 0, color: '#94A3B8', percentage: 0 },
  { name: 'Junk Leads', count: 0, color: '#CBD5E1', percentage: 0 }
];

export const SALES_EXECUTIVE_LEAD_STATUSES = [
  { id: 'se-st-1', name: 'NEW LEADS', count: 21, percentage: 42, color: '#0022FF' },
  { id: 'se-st-2', name: 'SITE VISIT / DEMO DONE', count: 5, percentage: 20, color: '#254BFF' },
  { id: 'se-st-3', name: 'FOLLOW UP SCHEDULED', count: 14, percentage: 18, color: '#0284C7' },
  { id: 'se-st-4', name: 'PROPOSAL / SLA UNDER REVIEW', count: 3, percentage: 10, color: '#2563EB' },
  { id: 'se-st-5', name: 'LOCATION / TECH FEASIBILITY', count: 1, percentage: 5, color: '#D97706' },
  { id: 'se-st-6', name: 'NOT INTERESTED / CLOSED', count: 0, percentage: 0, color: '#64748B' }
];

export const SALES_EXECUTIVE_SITE_VISITS_TODAY = [
  {
    id: 'SVT-1',
    leadName: 'Aarav Mehta',
    company: 'Tata Consultancy Tech Ltd',
    executive: 'Rahul Verma',
    time: '11:00 AM - 12:30 PM',
    location: 'Bandra-Kurla Complex (BKC), Mumbai',
    type: 'On-Premise Demonstration',
    status: 'Completed'
  },
  {
    id: 'SVT-2',
    leadName: 'Naveen Jindal',
    company: 'Reliance Digital Hub',
    executive: 'Sneha Rao',
    time: '03:00 PM - 04:30 PM',
    location: 'Electronic City, Bengaluru',
    type: 'Executive Architecture Review',
    status: 'Scheduled'
  },
  {
    id: 'SVT-3',
    leadName: 'Deepak Patel',
    company: 'Infosys Hi-Tech Campus',
    executive: 'Aditya Joshi',
    time: '05:30 PM - 06:30 PM',
    location: 'Gachibowli, Hyderabad',
    type: 'Dialer Pilot Setup & Field Test',
    status: 'Scheduled'
  }
];

export const SALES_EXECUTIVE_OBJECTIONS = [
  { id: 'OBJ-1', customer: 'Tata Consultancy Tech Ltd', executive: 'Rahul Verma', objection: 'Pricing & Budget Approval CapEx', status: 'Under Review', count: 4, solution: 'Offered flexible quarterly payment schedule' },
  { id: 'OBJ-2', customer: 'Reliance Cloud Solutions', executive: 'Sneha Rao', objection: 'Data Sovereignty & Local Encryption', status: 'Resolved', count: 2, solution: 'Shared AWS Mumbai region compliance certificate' },
  { id: 'OBJ-3', customer: 'Infosys Digital Systems', executive: 'Aditya Joshi', objection: 'Legacy Dialer Integration Delay', status: 'In Progress', count: 1, solution: 'Provided pre-built REST webhook connector' }
];


