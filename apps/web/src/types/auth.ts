export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'suspended';
  roles: Role[];
  orgId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  scope?: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  type: 'company' | 'department' | 'team';
  parentId?: string;
  tenantId: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  code: string;
  domain: string;
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  settings: TenantSettings;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  features: string[];
}

export interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  tenantCode?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  tenant: Tenant;
  token: string;
  refreshToken: string;
  expiresIn: number;
}