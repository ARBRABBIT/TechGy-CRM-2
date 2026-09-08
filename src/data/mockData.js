// TechGy Internal CRM Mock Data Store
// Color System: Primary Deep Navy #063669 & Off-White #F9F9F9
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
      { period: 'Q1', revenue: 3900000, target: 4000000 },
      { period: 'Q2', revenue: 4400000, target: 4200000 },
      { period: 'Q3', revenue: 4850000, target: 4500000 },
      { period: 'Q4 (Est)', revenue: 5050000, target: 4800000 },
    ]
  },
  FY: {
    revenue: '₹1,82,00,000',
    quarterly: '₹48,50,000',
    fy: '₹1,82,00,000',
    trend: [
      { period: '2022-23', revenue: 11000000, target: 10000000 },
      { period: '2023-24', revenue: 14500000, target: 13000000 },
      { period: '2024-25', revenue: 16800000, target: 16000000 },
      { period: '2025-26', revenue: 18200000, target: 17500000 },
    ]
  }
};

export const SOURCE_MIX_DATA = [
  { name: 'Website', count: 48, percentage: 37.5, color: '#063669' },
  { name: 'Referral', count: 32, percentage: 25.0, color: '#1A4F85' },
  { name: 'LinkedIn', count: 24, percentage: 18.75, color: '#2F69A1' },
  { name: 'Inbound Call', count: 12, percentage: 9.38, color: '#4C83BD' },
  { name: 'Campaign', count: 8, percentage: 6.25, color: '#6E9ED9' },
  { name: 'Partner', count: 4, percentage: 3.12, color: '#95B8E6' }
];

export const INITIAL_ACCOUNTS = [
  {
    id: 'ACC-101',
    companyName: 'Tata Consultancy Tech Ltd',
    industry: 'Enterprise Software',
    companySize: '500-1000 employees',
    website: 'www.tatatech.co.in',
    location: 'Mumbai, MH',
    accountOwner: 'Rajesh Sharma',
    estimatedAccountValue: '₹1,80,00,000',
    leadsCount: 3,
    contactsCount: 4,
    oppsCount: 2,
    proposalsCount: 2,
    createdDate: '2026-08-15'
  },
  {
    id: 'ACC-102',
    companyName: 'Reliance Cloud Solutions',
    industry: 'Cloud Infrastructure',
    companySize: '1000+ employees',
    website: 'www.reliancecloud.in',
    location: 'Bengaluru, KA',
    accountOwner: 'Priya Patel',
    estimatedAccountValue: '₹3,20,00,000',
    leadsCount: 2,
    contactsCount: 3,
    oppsCount: 1,
    proposalsCount: 1,
    createdDate: '2026-08-18'
  },
  {
    id: 'ACC-103',
    companyName: 'Infosys Digital Systems',
    industry: 'Healthcare IT',
    companySize: '250-500 employees',
    website: 'www.infosysdigital.co.in',
    location: 'Hyderabad, TS',
    accountOwner: 'Amit Verma',
    estimatedAccountValue: '₹1,40,00,000',
    leadsCount: 4,
    contactsCount: 5,
    oppsCount: 2,
    proposalsCount: 1,
    createdDate: '2026-08-20'
  },
  {
    id: 'ACC-104',
    companyName: 'HDFC Fintech Dynamics',
    industry: 'Financial Services',
    companySize: '100-250 employees',
    website: 'www.hdfcfintech.in',
    location: 'Delhi NCR',
    accountOwner: 'Ananya Rao',
    estimatedAccountValue: '₹95,00,000',
    leadsCount: 2,
    contactsCount: 2,
    oppsCount: 1,
    proposalsCount: 1,
    createdDate: '2026-08-22'
  },
  {
    id: 'ACC-105',
    companyName: 'Mahindra Supply Chain Logistics',
    industry: 'Supply Chain',
    companySize: '50-100 employees',
    website: 'www.mahindralogistics.co.in',
    location: 'Pune, MH',
    accountOwner: 'Vikram Malhotra',
    estimatedAccountValue: '₹75,00,000',
    leadsCount: 1,
    contactsCount: 2,
    oppsCount: 1,
    proposalsCount: 0,
    createdDate: '2026-08-25'
  },
  {
    id: 'ACC-106',
    companyName: 'GreenGrid Energy Pvt Ltd',
    industry: 'Renewable Energy & CleanTech',
    companySize: '250-500 employees',
    website: 'www.greengridenergy.in',
    location: 'Ahmedabad, GJ',
    accountOwner: 'Rahul Verma',
    estimatedAccountValue: '₹1,50,00,000',
    leadsCount: 1,
    contactsCount: 2,
    oppsCount: 1,
    proposalsCount: 1,
    createdDate: '2026-08-15'
  },
  {
    id: 'ACC-107',
    companyName: 'Apex Technologies Ltd',
    industry: 'Cloud Infrastructure & DevOps',
    companySize: '500-1000 employees',
    website: 'www.apextech.co.in',
    location: 'Bengaluru, KA',
    accountOwner: 'Priya Sharma',
    estimatedAccountValue: '₹2,10,00,000',
    leadsCount: 1,
    contactsCount: 2,
    oppsCount: 1,
    proposalsCount: 1,
    createdDate: '2026-08-20'
  },
  {
    id: 'ACC-108',
    companyName: 'Nexus Retails India',
    industry: 'Retail & Consumer Goods',
    companySize: '1000+ employees',
    website: 'www.nexusretails.in',
    location: 'Gurugram, HR',
    accountOwner: 'Rahul Verma',
    estimatedAccountValue: '₹1,25,00,000',
    leadsCount: 1,
    contactsCount: 3,
    oppsCount: 5,
    proposalsCount: 1,
    createdDate: '2026-08-22'
  }
];

export const INITIAL_LEADS = [
  {
    id: 'LD-201',
    leadName: 'Aarav Sharma',
    phoneNumber: '+91 98765 43210',
    emailId: 'aarav.sharma@tatatech.co.in',
    company: 'Tata Consultancy Tech Ltd',
    designation: 'VP of Technology',
    leadSource: 'Website',
    status: 'Qualified',
    leadOwner: 'Rajesh Sharma',
    priority: 'High',
    createdDate: getPastISO(2),
    lastActivity: 'Call completed, discussed CRM migration',
    nextFollowup: `${getTodayISO()} 15:30`,
    dueToday: true,
    isOverdue: false,
    notes: 'Looking to transition from legacy CRM to unified solution by Q4. Budget approved.',
    nextAction: 'Schedule technical demo call with solution engineering team'
  },
  {
    id: 'LD-202',
    leadName: 'Ananya Patel',
    phoneNumber: '+91 98123 45678',
    emailId: 'ananya.patel@reliancecloud.in',
    company: 'Reliance Cloud Solutions',
    designation: 'Director of Procurement',
    leadSource: 'Referral',
    status: 'Discussion',
    leadOwner: 'Priya Patel',
    priority: 'High',
    createdDate: getPastISO(5),
    lastActivity: 'Proposal sent, pending executive review',
    nextFollowup: `${getPastISO(2)} 11:00`, // Overdue
    dueToday: false,
    isOverdue: true,
    notes: 'Referred by executive board member. Requires custom SLA terms in proposal.',
    nextAction: 'Send revised commercial terms document and follow up on procurement timeline'
  },
  {
    id: 'LD-203',
    leadName: 'Rohan Verma',
    phoneNumber: '+91 97654 32109',
    emailId: 'rohan.verma@infosysdigital.co.in',
    company: 'Infosys Digital Systems',
    designation: 'Chief Technology Officer',
    leadSource: 'Inbound Call',
    status: 'New',
    leadOwner: 'Amit Verma',
    priority: 'Medium',
    createdDate: getPastISO(1),
    lastActivity: 'Inbound inquiry received regarding security compliance',
    nextFollowup: `${getTodayISO()} 16:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Interested in enterprise security module. Needs documentation on data encryption.',
    nextAction: 'Send security whitepaper and schedule discovery meeting'
  },
  {
    id: 'LD-204',
    leadName: 'Pooja Iyer',
    phoneNumber: '+91 96543 21098',
    emailId: 'pooja.iyer@hdfcfintech.in',
    company: 'HDFC Fintech Dynamics',
    designation: 'Head of Operations',
    leadSource: 'LinkedIn',
    status: 'Proposal',
    leadOwner: 'Ananya Rao',
    priority: 'High',
    createdDate: getPastISO(4),
    lastActivity: 'Demo completed, proposal presented',
    nextFollowup: `${getPastISO(1)} 14:00`, // Overdue
    dueToday: false,
    isOverdue: true,
    notes: 'Proposal PR-404 sent for ₹95 Lakhs annual license. Needs review with CFO.',
    nextAction: 'Call CFO directly to negotiate final payment milestones'
  },
  {
    id: 'LD-205',
    leadName: 'Karan Mehta',
    phoneNumber: '+91 95432 10987',
    emailId: 'karan.mehta@mahindralogistics.co.in',
    company: 'Mahindra Supply Chain Logistics',
    designation: 'IT Director',
    leadSource: 'Campaign',
    status: 'Contacted',
    leadOwner: 'Vikram Malhotra',
    priority: 'Low',
    createdDate: getPastISO(6),
    lastActivity: 'Intro email sent, opened twice',
    nextFollowup: `${getPastISO(3)} 10:00`, // Overdue
    dueToday: false,
    isOverdue: true,
    notes: 'Downloaded whitepaper from summer marketing campaign.',
    nextAction: 'Send follow-up email offering tailored solution overview'
  },
  {
    id: 'LD-206',
    leadName: 'Sneha Kulkarni',
    phoneNumber: '+91 94321 09876',
    emailId: 'sneha.k@tatatech.co.in',
    company: 'Tata Consultancy Tech Ltd',
    designation: 'Sales Operations Manager',
    leadSource: 'Website',
    status: 'Qualified',
    leadOwner: 'Rajesh Sharma',
    priority: 'Medium',
    createdDate: getPastISO(3),
    lastActivity: 'Discovery call held on lead management',
    nextFollowup: `${getTodayISO()} 17:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Evaluator for lead management workflow.',
    nextAction: 'Confirm scope for sales team seat count'
  },
  {
    id: 'LD-207',
    leadName: 'Aditya Joshi',
    phoneNumber: '+91 93210 98765',
    emailId: 'aditya.joshi@reliancecloud.in',
    company: 'Reliance Cloud Solutions',
    designation: 'VP of Product',
    leadSource: 'Partner',
    status: 'Negotiation',
    leadOwner: 'Priya Patel',
    priority: 'High',
    createdDate: getPastISO(5),
    lastActivity: 'Contract revision meeting held',
    nextFollowup: `${getTodayISO()} 18:00`,
    dueToday: true,
    isOverdue: false,
    notes: 'Negotiating multi-year discount structure.',
    nextAction: 'Send updated contract draft with approved 5% volume discount'
  },
  {
    id: 'LD-208',
    leadName: 'Deepak Nair',
    phoneNumber: '+91 92109 87654',
    emailId: 'deepak.nair@wiprocloud.in',
    company: 'Wipro Enterprise Cloud',
    designation: 'Head of Infrastructure',
    leadSource: 'Campaign',
    status: 'Contacted',
    leadOwner: 'Amit Verma',
    priority: 'Medium',
    createdDate: getPastISO(18),
    lastActivity: 'Assessment sent, awaiting technical evaluation',
    nextFollowup: `${getPastISO(12)} 14:30`, // 12 days ago (Last 30 Days, not Last 7 Days)
    dueToday: false,
    isOverdue: true,
    notes: 'Follow up on cloud assessment report sent end of August.',
    nextAction: 'Review infrastructure assessment with technical lead'
  },
  {
    id: 'LD-209',
    leadName: 'Sunita Rao',
    phoneNumber: '+91 91098 76543',
    emailId: 'sunita.rao@airtelbusiness.in',
    company: 'Bharti Airtel Business',
    designation: 'VP of Enterprise Solutions',
    leadSource: 'LinkedIn',
    status: 'Discussion',
    leadOwner: 'Vikram Malhotra',
    priority: 'High',
    createdDate: getPastISO(1),
    lastActivity: 'Product demo scheduled for next week',
    nextFollowup: `${getFutureISO(6)} 11:30`, // 6 days in future (This Month & Quarter, not Last 7/30 Days)
    dueToday: false,
    isOverdue: false,
    notes: 'Scheduled product demo with VP of Enterprise Solutions for next week.',
    nextAction: 'Prepare tailored enterprise demonstration deck'
  },
  {
    id: 'LD-210',
    leadName: 'Vikrant Joshi',
    phoneNumber: '+91 90987 65432',
    emailId: 'vikrant.j@ltinfotech.com',
    company: 'L&T Infotech Systems',
    designation: 'Procurement Director',
    leadSource: 'Referral',
    status: 'Qualified',
    leadOwner: 'Rajesh Sharma',
    priority: 'Medium',
    createdDate: getPastISO(3),
    lastActivity: 'Initial qualification complete, budget allocated for Q4',
    nextFollowup: `${getFutureISO(35)} 10:00`, // Next month (FY & All Time)
    dueToday: false,
    isOverdue: false,
    notes: 'Longer evaluation cycle; decision planned for next month.',
    nextAction: 'Send quarterly roadmap update and follow up on procurement timeline'
  }
];

export const INITIAL_OPPORTUNITIES = [
  {
    id: 'OPP-101',
    opportunityName: 'GreenGrid – ERP Integration',
    accountName: 'GreenGrid Energy Pvt Ltd',
    estimatedValue: '₹45.50 Lakh',
    currentStage: 'Proposal Sent',
    probability: '60%',
    expectedClosureDate: '28 Sep 2026',
    createdDate: '2026-08-15',
    owner: 'Rahul Verma',
    score: 78,
    visualLevel: 'High'
  },
  {
    id: 'OPP-102',
    opportunityName: 'Apex Tech – Cloud Migration',
    accountName: 'Apex Technologies Ltd',
    estimatedValue: '₹1.20 Cr',
    currentStage: 'Negotiation',
    probability: '85%',
    expectedClosureDate: '15 Sep 2026',
    createdDate: '2026-08-18',
    owner: 'Priya Sharma',
    score: 90,
    visualLevel: 'High'
  },
  {
    id: 'OPP-103',
    opportunityName: 'Nexus – Q4 Software License',
    accountName: 'Nexus Retails India',
    estimatedValue: '₹8.75 Lakh',
    currentStage: 'Discovery',
    probability: '20%',
    expectedClosureDate: '10 Sep 2026',
    createdDate: '2026-08-20',
    owner: 'Rahul Verma',
    score: 45,
    visualLevel: 'Low'
  },
  {
    id: 'OPP-104',
    opportunityName: 'Nexus – Q4 Software License',
    accountName: 'Nexus Retails India',
    estimatedValue: '₹8.75 Lakh',
    currentStage: 'Discovery',
    probability: '20%',
    expectedClosureDate: '12 Sep 2026',
    createdDate: '2026-08-22',
    owner: 'Rahul Verma',
    score: 45,
    visualLevel: 'Low'
  },
  {
    id: 'OPP-105',
    opportunityName: 'Nexus – Q4 Software License',
    accountName: 'Nexus Retails India',
    estimatedValue: '₹8.75 Lakh',
    currentStage: 'Discovery',
    probability: '20%',
    expectedClosureDate: '14 Sep 2026',
    createdDate: '2026-08-25',
    owner: 'Rahul Verma',
    score: 45,
    visualLevel: 'Low'
  },
  {
    id: 'OPP-106',
    opportunityName: 'Nexus – Q4 Software License',
    accountName: 'Nexus Retails India',
    estimatedValue: '₹8.75 Lakh',
    currentStage: 'Discovery',
    probability: '20%',
    expectedClosureDate: '16 Sep 2026',
    createdDate: '2026-08-26',
    owner: 'Rahul Verma',
    score: 45,
    visualLevel: 'Low'
  },
  {
    id: 'OPP-107',
    opportunityName: 'Nexus – Q4 Software License',
    accountName: 'Nexus Retails India',
    estimatedValue: '₹8.75 Lakh',
    currentStage: 'Discovery',
    probability: '20%',
    expectedClosureDate: '18 Sep 2026',
    createdDate: '2026-08-28',
    owner: 'Rahul Verma',
    score: 45,
    visualLevel: 'Low'
  },
  {
    id: 'OPP-108',
    opportunityName: 'Tata Tech CRM Enterprise License Expansion',
    accountName: 'Tata Consultancy Tech Ltd',
    estimatedValue: '₹1.80 Cr',
    currentStage: 'Proposal Sent',
    probability: '80%',
    expectedClosureDate: '30 Sep 2026',
    createdDate: '2026-08-10',
    owner: 'Rajesh Sharma',
    score: 85,
    visualLevel: 'High'
  },
  {
    id: 'OPP-109',
    opportunityName: 'Reliance Cloud Multi-Region Rollout',
    accountName: 'Reliance Cloud Solutions',
    estimatedValue: '₹3.20 Cr',
    currentStage: 'Negotiation',
    probability: '90%',
    expectedClosureDate: '15 Sep 2026',
    createdDate: '2026-08-05',
    owner: 'Priya Patel',
    score: 92,
    visualLevel: 'High'
  },
  {
    id: 'OPP-110',
    opportunityName: 'Infosys Digital Secure Workspace',
    accountName: 'Infosys Digital Systems',
    estimatedValue: '₹1.40 Cr',
    currentStage: 'Discovery',
    probability: '60%',
    expectedClosureDate: '25 Sep 2026',
    createdDate: '2026-08-12',
    owner: 'Amit Verma',
    score: 65,
    visualLevel: 'Medium'
  },
  ...Array.from({ length: 38 }).map((_, idx) => {
    const num = idx + 11;
    const stages = ['Discovery', 'Proposal Sent', 'Negotiation', 'Qualified', 'New'];
    const owners = ['Rahul Verma', 'Priya Sharma', 'Rajesh Sharma', 'Priya Patel', 'Amit Verma', 'Ananya Rao', 'Vikram Malhotra'];
    const companies = ['Zomato Logistics', 'Swiggy Pay', 'Paytm Tech', 'Razorpay Payments', 'Zerodha Capital', 'Pine Labs', 'Meesho Commerce'];
    const stg = stages[num % stages.length];
    const own = owners[num % owners.length];
    const comp = companies[num % companies.length];
    const prob = stg === 'Negotiation' ? '85%' : stg === 'Proposal Sent' ? '65%' : stg === 'Discovery' ? '20%' : '40%';
    return {
      id: `OPP-${100 + num}`,
      opportunityName: `${comp} – Enterprise Integration`,
      accountName: comp,
      estimatedValue: `₹${(15 + num * 2.5).toFixed(2)} Lakh`,
      currentStage: stg,
      probability: prob,
      expectedClosureDate: `${(num % 28) + 1} Sep 2026`,
      createdDate: '2026-08-15',
      owner: own,
      score: 50 + (num % 45),
      visualLevel: num % 2 === 0 ? 'High' : 'Medium'
    };
  })
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
  }
];

export const INITIAL_PROPOSALS = [
  {
    id: 'PR-401',
    proposalId: 'PR-2026-001',
    company: 'Tata Consultancy Tech Ltd',
    opportunity: 'Tata Tech CRM Enterprise License Expansion',
    proposalDate: '2026-08-20',
    proposalValue: '₹1,80,00,000',
    estimatedAccountWorth: '₹2,20,00,000',
    status: 'Negotiation',
    validityDate: '2026-09-30',
    owner: 'Rajesh Sharma',
    notes: 'Includes 100 user seats, custom API connectors, and 24/7 dedicated support SLA.'
  },
  {
    id: 'PR-402',
    proposalId: 'PR-2026-002',
    company: 'Reliance Cloud Solutions',
    opportunity: 'Reliance Cloud Multi-Region Rollout',
    proposalDate: '2026-08-15',
    proposalValue: '₹3,20,00,000',
    estimatedAccountWorth: '₹4,00,00,000',
    status: 'Sent',
    validityDate: '2026-09-15',
    owner: 'Priya Patel',
    notes: 'Enterprise multi-region cloud deployment package.'
  },
  {
    id: 'PR-403',
    proposalId: 'PR-2026-003',
    company: 'Infosys Digital Systems',
    opportunity: 'Infosys Digital Secure Workspace',
    proposalDate: '2026-08-25',
    proposalValue: '₹1,40,00,000',
    estimatedAccountWorth: '₹1,60,00,000',
    status: 'Viewed',
    validityDate: '2026-10-15',
    owner: 'Amit Verma',
    notes: 'Enterprise cloud instance with dedicated hardware isolation.'
  },
  {
    id: 'PR-404',
    proposalId: 'PR-2026-004',
    company: 'HDFC Fintech Dynamics',
    opportunity: 'HDFC Core Analytics Integration',
    proposalDate: '2026-08-22',
    proposalValue: '₹95,00,000',
    estimatedAccountWorth: '₹1,10,00,000',
    status: 'Draft',
    validityDate: '2026-09-25',
    owner: 'Ananya Rao',
    notes: 'Standard annual subscription + analytics add-on module.'
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
    id: 'NOTIF-2',
    title: 'Opportunity Won',
    message: 'Reliance Cloud Solutions accepted proposal #PR-902 (₹3.2 Cr) and moved to Won stage.',
    timestamp: '45 mins ago',
    category: 'Opportunity',
    isRead: false,
    priority: 'High',
    targetModule: 'opportunities'
  },
  {
    id: 'NOTIF-3',
    title: 'New Lead Assigned',
    message: 'Rajesh Sharma assigned a new lead: Infosys Enterprise Systems.',
    timestamp: '2 hours ago',
    category: 'Lead',
    isRead: false,
    priority: 'Normal',
    targetModule: 'leads'
  },
  {
    id: 'NOTIF-4',
    title: 'Activity Scheduled',
    message: 'Product demo meeting with Priya Patel scheduled for today at 3:30 PM.',
    timestamp: '3 hours ago',
    category: 'Activity',
    isRead: false,
    priority: 'Normal',
    targetModule: 'activities'
  },
  {
    id: 'NOTIF-5',
    title: 'Proposal Viewed',
    message: 'Mahindra Tech Solutions opened commercial proposal #PR-904.',
    timestamp: '5 hours ago',
    category: 'Proposal',
    isRead: false,
    priority: 'Normal',
    targetModule: 'proposals'
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
