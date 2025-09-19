export interface Customer {
  id: string;
  name: string;
  code: string;
  type: 'individual' | 'company';
  industry?: string;
  source: 'website' | 'referral' | 'advertising' | 'social_media' | 'cold_call' | 'other';
  status: 'prospect' | 'lead' | 'customer' | 'inactive';
  tags: string[];

  // 联系信息
  contactInfo: {
    email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    address?: Address;
  };

  // 公司信息（当 type 为 company 时）
  companyInfo?: {
    legalName: string;
    registrationNumber: string;
    taxId: string;
    foundedYear?: number;
    employeeCount?: number;
    annualRevenue?: number;
  };

  // 个人信息（当 type 为 individual 时）
  personalInfo?: {
    firstName: string;
    lastName: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    jobTitle?: string;
    companyName?: string;
  };

  // 业务信息
  businessInfo: {
    assignedUserId: string;
    assignedUserName: string;
    priority: 'low' | 'medium' | 'high';
    creditLimit?: number;
    paymentTerms?: string;
    preferredLanguage: string;
    timezone: string;
  };

  // 统计信息
  stats: {
    totalOrders: number;
    totalRevenue: number;
    lastOrderDate?: string;
    lastContactDate?: string;
    opportunityCount: number;
  };

  // 系统信息
  tenantId: string;
  orgId: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Address {
  country: string;
  province: string;
  city: string;
  district?: string;
  street: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Contact {
  id: string;
  customerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  jobTitle?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary: boolean;
  tags: string[];
  notes?: string;
  socialProfiles?: SocialProfile[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialProfile {
  platform: 'linkedin' | 'wechat' | 'qq' | 'weibo' | 'twitter' | 'facebook' | 'other';
  username: string;
  url?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description?: string;
  customerId: string;
  customerName: string;

  // 商机信息
  stage: OpportunityStage;
  status: 'open' | 'won' | 'lost' | 'cancelled';
  probability: number; // 0-100
  amount: number;
  currency: string;
  expectedCloseDate: string;
  actualCloseDate?: string;

  // 分配信息
  assignedUserId: string;
  assignedUserName: string;
  teamId?: string;

  // 来源信息
  source: 'inbound' | 'outbound' | 'referral' | 'partner' | 'website' | 'event' | 'other';
  campaign?: string;

  // 竞争信息
  competitors?: string[];
  winReason?: string;
  lossReason?: string;

  // 标签和分类
  tags: string[];
  priority: 'low' | 'medium' | 'high';

  // 关联信息
  contactIds: string[];
  productIds: string[];

  // 系统信息
  tenantId: string;
  orgId: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface OpportunityStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  isWon: boolean;
  isLost: boolean;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note' | 'demo' | 'proposal' | 'other';
  subject: string;
  description?: string;

  // 关联对象
  relatedType: 'customer' | 'contact' | 'opportunity' | 'deal';
  relatedId: string;
  relatedName: string;

  // 时间信息
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // 分钟

  // 状态信息
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';

  // 参与者
  assignedUserId: string;
  assignedUserName: string;
  participants: Participant[];

  // 结果信息
  outcome?: 'successful' | 'unsuccessful' | 'rescheduled' | 'no_response';
  notes?: string;
  followUpDate?: string;

  // 附件
  attachments: string[];

  // 系统信息
  tenantId: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Participant {
  type: 'internal' | 'customer' | 'partner';
  userId?: string;
  contactId?: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: OpportunityStage[];
  isDefault: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmDashboardStats {
  totalCustomers: number;
  totalOpportunities: number;
  totalRevenue: number;
  conversionRate: number;
  averageDealSize: number;
  salesCycle: number; // 天数

  monthlyStats: {
    newCustomers: number;
    newOpportunities: number;
    wonDeals: number;
    revenue: number;
  };

  pipelineStats: {
    stageId: string;
    stageName: string;
    count: number;
    totalAmount: number;
  }[];

  topPerformers: {
    userId: string;
    userName: string;
    deals: number;
    revenue: number;
  }[];
}