# ERP 系统 API 设计规范

## 目录
1. [API 设计原则](#1-api-设计原则)
2. [RESTful API 规范](#2-restful-api-规范)
3. [认证与授权](#3-认证与授权)
4. [请求响应格式](#4-请求响应格式)
5. [错误处理](#5-错误处理)
6. [API 版本管理](#6-api-版本管理)
7. [多租户 API 设计](#7-多租户-api-设计)
8. [核心 API 接口](#8-核心-api-接口)
9. [CRM 模块 API](#9-crm-模块-api)
10. [性能优化](#10-性能优化)

---

## 1. API 设计原则

### 1.1 设计哲学

```typescript
/**
 * API 设计原则
 *
 * 1. 一致性优先：统一的命名规范、响应格式、错误处理
 * 2. 开发者友好：清晰的文档、直观的接口设计、有意义的错误信息
 * 3. 性能导向：支持批量操作、分页查询、字段筛选、缓存策略
 * 4. 安全第一：认证授权、输入验证、输出过滤、审计日志
 * 5. 向后兼容：版本管理、渐进式弃用、平滑迁移
 * 6. 可扩展性：模块化设计、插件支持、第三方集成
 */
```

### 1.2 URL 设计规范

```
基础 URL 结构：
https://erp.com/api/v1/{tenant_id}/{module}/{resource}

示例：
- 获取客户列表：GET /api/v1/abc123/crm/customers
- 创建销售机会：POST /api/v1/abc123/crm/opportunities
- 更新用户信息：PUT /api/v1/abc123/system/users/uuid

路径参数：
- {tenant_id}: 租户标识符
- {module}: 模块名称 (system/crm/finance/inventory)
- {resource}: 资源名称（复数形式）
- {id}: 资源唯一标识符（UUID）
```

### 1.3 HTTP 方法语义

```
GET     - 查询资源（幂等）
POST    - 创建资源（非幂等）
PUT     - 完整更新资源（幂等）
PATCH   - 部分更新资源（非幂等）
DELETE  - 删除资源（幂等）

特殊操作：
POST /api/v1/{tenant_id}/crm/customers/{id}/actions/activate   - 激活客户
POST /api/v1/{tenant_id}/crm/opportunities/{id}/actions/close - 关闭销售机会
```

---

## 2. RESTful API 规范

### 2.1 资源命名规范

```typescript
// 资源命名示例
interface APIResourceNaming {
  // 基础资源（复数名词）
  users: "/users";           // 用户管理
  organizations: "/organizations"; // 组织架构
  roles: "/roles";           // 角色管理
  permissions: "/permissions"; // 权限管理

  // CRM 资源
  customers: "/customers";    // 客户管理
  contacts: "/contacts";      // 联系人
  opportunities: "/opportunities"; // 销售机会
  quotes: "/quotes";         // 报价单
  orders: "/orders";         // 销售订单

  // 嵌套资源
  customerContacts: "/customers/{id}/contacts"; // 客户的联系人
  userRoles: "/users/{id}/roles";              // 用户的角色

  // 集合操作
  batchUsers: "/users/batch";                  // 批量用户操作
  exportCustomers: "/customers/export";       // 导出客户数据
}
```

### 2.2 查询参数规范

```typescript
// 查询参数标准化
interface QueryParameters {
  // 分页参数
  page?: number;        // 页码，从1开始
  limit?: number;       // 每页条数，默认20，最大100
  offset?: number;      // 偏移量（可选，与page二选一）

  // 排序参数
  sort?: string;        // 排序字段，如 "created_at"
  order?: "asc" | "desc"; // 排序方向，默认desc

  // 筛选参数
  filter?: {
    status?: string[];   // 状态筛选，支持多值
    created_after?: string; // 创建时间筛选
    created_before?: string;
    search?: string;     // 全文搜索
  };

  // 字段筛选
  fields?: string;      // 返回字段，如 "id,name,email"
  expand?: string;      // 关联数据展开，如 "organization,roles"

  // 格式化参数
  format?: "json" | "csv" | "xlsx"; // 响应格式
}

// 示例查询 URL
const exampleQueries = [
  "/api/v1/abc123/crm/customers?page=1&limit=20&sort=created_at&order=desc",
  "/api/v1/abc123/crm/customers?filter[status]=active&filter[created_after]=2024-01-01",
  "/api/v1/abc123/crm/customers?search=张三&fields=id,name,email&expand=contacts",
  "/api/v1/abc123/crm/opportunities?filter[sales_rep_id]=uuid&sort=estimated_value&order=desc"
];
```

---

## 3. 认证与授权

### 3.1 JWT 认证方案

```typescript
// JWT Token 结构
interface JWTPayload {
  // 标准声明
  iss: string;          // 签发者
  sub: string;          // 主题（用户ID）
  aud: string;          // 受众
  exp: number;          // 过期时间
  iat: number;          // 签发时间
  jti: string;          // JWT ID

  // 自定义声明
  tenant_id: string;    // 租户ID
  user_id: string;      // 用户ID
  username: string;     // 用户名
  email: string;        // 邮箱
  roles: string[];      // 角色列表
  permissions: string[]; // 权限列表
  data_scope: string;   // 数据范围
  session_id: string;   // 会话ID
}

// 认证请求示例
interface AuthRequest {
  grant_type: "password" | "refresh_token" | "authorization_code";
  username?: string;    // 用户名登录
  password?: string;    // 密码
  refresh_token?: string; // 刷新令牌
  tenant_code?: string; // 租户代码
  scope?: string;       // 权限范围
}

// 认证响应
interface AuthResponse {
  access_token: string; // 访问令牌
  refresh_token: string; // 刷新令牌
  token_type: "Bearer"; // 令牌类型
  expires_in: number;   // 过期时间（秒）
  scope: string;        // 权限范围
  user: UserProfile;    // 用户信息
}
```

### 3.2 API 权限控制

```typescript
// 权限装饰器示例
interface PermissionDecorator {
  resource: string;     // 资源类型
  action: string;       // 操作类型
  data_scope?: string;  // 数据范围
  field_level?: boolean; // 是否字段级权限
}

// 示例权限配置
const permissionExamples = {
  "GET /api/v1/{tenant_id}/crm/customers": {
    resource: "customers",
    action: "read",
    data_scope: "self" // 只能查看自己的客户
  },
  "POST /api/v1/{tenant_id}/crm/customers": {
    resource: "customers",
    action: "create"
  },
  "PUT /api/v1/{tenant_id}/crm/customers/:id": {
    resource: "customers",
    action: "update",
    data_scope: "self"
  },
  "DELETE /api/v1/{tenant_id}/crm/customers/:id": {
    resource: "customers",
    action: "delete",
    data_scope: "admin" // 仅管理员可删除
  }
};
```

---

## 4. 请求响应格式

### 4.1 统一响应格式

```typescript
// 标准 API 响应格式
interface APIResponse<T = any> {
  code: number;         // 业务状态码
  message: string;      // 响应消息
  data: T;             // 响应数据
  meta?: {
    timestamp: string;  // 响应时间戳
    request_id: string; // 请求追踪ID
    version: string;    // API 版本
    tenant_id: string;  // 租户ID
  };
  pagination?: {
    page: number;       // 当前页码
    limit: number;      // 每页条数
    total: number;      // 总记录数
    pages: number;      // 总页数
  };
  links?: {
    self: string;       // 当前页链接
    first?: string;     // 首页链接
    prev?: string;      // 上一页链接
    next?: string;      // 下一页链接
    last?: string;      // 末页链接
  };
}

// 成功响应示例
const successResponse: APIResponse<User[]> = {
  code: 200,
  message: "获取用户列表成功",
  data: [
    {
      id: "uuid-1",
      username: "zhangsan",
      email: "zhangsan@example.com",
      full_name: "张三",
      status: "active"
    }
  ],
  meta: {
    timestamp: "2024-12-20T10:30:00Z",
    request_id: "req-uuid-123",
    version: "1.0.0",
    tenant_id: "tenant-abc123"
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 100,
    pages: 5
  }
};
```

### 4.2 请求格式规范

```typescript
// 创建资源请求
interface CreateUserRequest {
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  mobile?: string;
  org_id: string;
  role_ids: string[];
  employee_id?: string;
}

// 更新资源请求
interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  mobile?: string;
  job_title?: string;
  status?: "active" | "inactive";
}

// 批量操作请求
interface BatchRequest<T> {
  action: "create" | "update" | "delete";
  items: T[];
  options?: {
    ignore_errors?: boolean;  // 忽略单个错误
    validate_only?: boolean;  // 仅验证不执行
  };
}

// 搜索请求
interface SearchRequest {
  query: string;            // 搜索关键词
  filters?: Record<string, any>; // 筛选条件
  facets?: string[];        // 聚合字段
  highlight?: boolean;      // 高亮搜索结果
}
```

---

## 5. 错误处理

### 5.1 错误响应格式

```typescript
// 错误响应结构
interface ErrorResponse {
  code: number;           // HTTP 状态码
  error: {
    type: string;         // 错误类型
    message: string;      // 错误消息
    details?: string;     // 详细描述
    field?: string;       // 相关字段
    validation_errors?: ValidationError[]; // 验证错误
  };
  meta: {
    timestamp: string;
    request_id: string;
    trace_id?: string;    // 追踪ID
  };
}

// 验证错误详情
interface ValidationError {
  field: string;          // 字段名
  code: string;          // 错误码
  message: string;       // 错误消息
  value?: any;           // 提交的值
}

// 错误类型定义
enum ErrorType {
  VALIDATION_ERROR = "validation_error",
  AUTHENTICATION_ERROR = "authentication_error",
  AUTHORIZATION_ERROR = "authorization_error",
  NOT_FOUND_ERROR = "not_found_error",
  CONFLICT_ERROR = "conflict_error",
  RATE_LIMIT_ERROR = "rate_limit_error",
  INTERNAL_ERROR = "internal_error",
  SERVICE_UNAVAILABLE = "service_unavailable"
}
```

### 5.2 HTTP 状态码规范

```typescript
// 状态码使用规范
const HTTPStatusCodes = {
  // 2xx 成功
  200: "OK - 请求成功",
  201: "Created - 资源创建成功",
  202: "Accepted - 请求已接受，异步处理",
  204: "No Content - 请求成功，无返回内容",

  // 4xx 客户端错误
  400: "Bad Request - 请求参数错误",
  401: "Unauthorized - 未认证",
  403: "Forbidden - 无权限访问",
  404: "Not Found - 资源不存在",
  409: "Conflict - 资源冲突",
  422: "Unprocessable Entity - 验证失败",
  429: "Too Many Requests - 请求频率限制",

  // 5xx 服务器错误
  500: "Internal Server Error - 服务器内部错误",
  502: "Bad Gateway - 网关错误",
  503: "Service Unavailable - 服务不可用",
  504: "Gateway Timeout - 网关超时"
};

// 错误响应示例
const errorExamples = {
  validationError: {
    code: 422,
    error: {
      type: "validation_error",
      message: "请求数据验证失败",
      validation_errors: [
        {
          field: "email",
          code: "invalid_format",
          message: "邮箱格式不正确",
          value: "invalid-email"
        },
        {
          field: "username",
          code: "already_exists",
          message: "用户名已存在",
          value: "zhangsan"
        }
      ]
    },
    meta: {
      timestamp: "2024-12-20T10:30:00Z",
      request_id: "req-uuid-123"
    }
  },

  authenticationError: {
    code: 401,
    error: {
      type: "authentication_error",
      message: "访问令牌已过期",
      details: "请重新登录获取新的访问令牌"
    },
    meta: {
      timestamp: "2024-12-20T10:30:00Z",
      request_id: "req-uuid-123"
    }
  }
};
```

---

## 6. API 版本管理

### 6.1 版本控制策略

```typescript
// 版本控制方案
interface APIVersioning {
  // URL 路径版本控制（推荐）
  url_versioning: {
    pattern: "/api/v{major}/",
    examples: ["/api/v1/", "/api/v2/"],
    description: "主版本号变更时使用新路径"
  };

  // Header 版本控制（次要版本）
  header_versioning: {
    header: "API-Version",
    format: "{major}.{minor}",
    examples: ["1.0", "1.1", "2.0"],
    description: "次要版本变更时使用Header"
  };

  // 版本兼容性策略
  compatibility: {
    backward_compatible: "次要版本向后兼容",
    breaking_changes: "主版本允许破坏性变更",
    deprecation_period: "6个月弃用过渡期",
    support_policy: "同时支持2个主版本"
  };
}

// 版本弃用公告
interface DeprecationNotice {
  deprecated_version: string;   // 弃用版本
  replacement_version: string; // 替代版本
  deprecation_date: string;    // 弃用日期
  end_of_life_date: string;    // 停止支持日期
  migration_guide: string;     // 迁移指南URL
  breaking_changes: string[];  // 破坏性变更列表
}
```

---

## 7. 多租户 API 设计

### 7.1 租户隔离策略

```typescript
// 租户上下文
interface TenantContext {
  tenant_id: string;        // 租户ID
  tenant_code: string;      // 租户代码
  isolation_mode: "shared" | "isolated"; // 隔离模式
  subscription_plan: string; // 订阅计划
  feature_flags: Record<string, boolean>; // 功能开关
  rate_limits: {
    requests_per_minute: number;
    concurrent_requests: number;
  };
}

// 租户级别的 API 限制
interface TenantLimits {
  max_users: number;        // 最大用户数
  max_storage_gb: number;   // 最大存储空间
  max_api_calls_per_day: number; // 每日API调用限制
  enabled_modules: string[]; // 启用的模块
  custom_fields_limit: number; // 自定义字段限制
}

// 租户配置 API
const tenantAPIs = {
  "GET /api/v1/{tenant_id}/tenant/config": "获取租户配置",
  "PUT /api/v1/{tenant_id}/tenant/config": "更新租户配置",
  "GET /api/v1/{tenant_id}/tenant/usage": "获取资源使用情况",
  "GET /api/v1/{tenant_id}/tenant/limits": "获取使用限制",
  "POST /api/v1/{tenant_id}/tenant/upgrade": "升级订阅计划"
};
```

---

## 8. 核心 API 接口

### 8.1 认证授权 API

```typescript
// 认证相关 API
interface AuthAPIs {
  // 用户认证
  "POST /api/v1/auth/login": {
    summary: "用户登录";
    request: {
      username: string;
      password: string;
      tenant_code: string;
      remember_me?: boolean;
      captcha?: string;
    };
    response: AuthResponse;
  };

  "POST /api/v1/auth/logout": {
    summary: "用户登出";
    request: {};
    response: { message: string };
  };

  "POST /api/v1/auth/refresh": {
    summary: "刷新访问令牌";
    request: {
      refresh_token: string;
    };
    response: AuthResponse;
  };

  // 密码管理
  "POST /api/v1/auth/forgot-password": {
    summary: "忘记密码";
    request: {
      email: string;
      tenant_code: string;
    };
    response: { message: string };
  };

  "POST /api/v1/auth/reset-password": {
    summary: "重置密码";
    request: {
      token: string;
      new_password: string;
      confirm_password: string;
    };
    response: { message: string };
  };

  // 两因素认证
  "POST /api/v1/auth/2fa/enable": {
    summary: "启用两因素认证";
    request: {
      password: string;
    };
    response: {
      secret: string;
      qr_code: string;
      backup_codes: string[];
    };
  };

  "POST /api/v1/auth/2fa/verify": {
    summary: "验证两因素认证";
    request: {
      token: string;
    };
    response: { verified: boolean };
  };
}
```

### 8.2 用户管理 API

```typescript
// 用户管理 API
interface UserAPIs {
  "GET /api/v1/{tenant_id}/system/users": {
    summary: "获取用户列表";
    query: {
      page?: number;
      limit?: number;
      status?: "active" | "inactive" | "suspended";
      org_id?: string;
      role_id?: string;
      search?: string;
      sort?: string;
      order?: "asc" | "desc";
    };
    response: APIResponse<User[]>;
  };

  "GET /api/v1/{tenant_id}/system/users/{id}": {
    summary: "获取用户详情";
    params: { id: string };
    response: APIResponse<User>;
  };

  "POST /api/v1/{tenant_id}/system/users": {
    summary: "创建用户";
    request: CreateUserRequest;
    response: APIResponse<User>;
  };

  "PUT /api/v1/{tenant_id}/system/users/{id}": {
    summary: "更新用户";
    params: { id: string };
    request: UpdateUserRequest;
    response: APIResponse<User>;
  };

  "DELETE /api/v1/{tenant_id}/system/users/{id}": {
    summary: "删除用户";
    params: { id: string };
    response: APIResponse<{}>;
  };

  // 用户角色管理
  "GET /api/v1/{tenant_id}/system/users/{id}/roles": {
    summary: "获取用户角色";
    params: { id: string };
    response: APIResponse<Role[]>;
  };

  "POST /api/v1/{tenant_id}/system/users/{id}/roles": {
    summary: "分配角色";
    params: { id: string };
    request: {
      role_ids: string[];
      valid_until?: string;
    };
    response: APIResponse<{}>;
  };

  "DELETE /api/v1/{tenant_id}/system/users/{id}/roles/{role_id}": {
    summary: "移除角色";
    params: { id: string; role_id: string };
    response: APIResponse<{}>;
  };

  // 批量操作
  "POST /api/v1/{tenant_id}/system/users/batch": {
    summary: "批量用户操作";
    request: BatchRequest<any>;
    response: APIResponse<BatchResult>;
  };
}
```

### 8.3 组织架构 API

```typescript
// 组织架构 API
interface OrganizationAPIs {
  "GET /api/v1/{tenant_id}/system/organizations": {
    summary: "获取组织架构";
    query: {
      tree?: boolean;      // 是否返回树形结构
      level?: number;      // 限制层级
      parent_id?: string;  // 父级组织ID
    };
    response: APIResponse<Organization[]>;
  };

  "POST /api/v1/{tenant_id}/system/organizations": {
    summary: "创建组织";
    request: {
      parent_id?: string;
      code: string;
      name: string;
      org_type: "company" | "department" | "team";
      description?: string;
    };
    response: APIResponse<Organization>;
  };

  "PUT /api/v1/{tenant_id}/system/organizations/{id}": {
    summary: "更新组织";
    params: { id: string };
    request: {
      name?: string;
      description?: string;
      parent_id?: string;
    };
    response: APIResponse<Organization>;
  };

  "DELETE /api/v1/{tenant_id}/system/organizations/{id}": {
    summary: "删除组织";
    params: { id: string };
    response: APIResponse<{}>;
  };

  // 组织成员管理
  "GET /api/v1/{tenant_id}/system/organizations/{id}/members": {
    summary: "获取组织成员";
    params: { id: string };
    response: APIResponse<User[]>;
  };

  "POST /api/v1/{tenant_id}/system/organizations/{id}/members": {
    summary: "添加组织成员";
    params: { id: string };
    request: {
      user_ids: string[];
    };
    response: APIResponse<{}>;
  };
}
```

---

## 9. CRM 模块 API

### 9.1 客户管理 API

```typescript
// 客户管理 API
interface CustomerAPIs {
  "GET /api/v1/{tenant_id}/crm/customers": {
    summary: "获取客户列表";
    query: {
      page?: number;
      limit?: number;
      customer_type?: "individual" | "company";
      customer_level?: "vip" | "important" | "normal" | "general";
      status?: "active" | "inactive" | "potential" | "lost";
      sales_rep_id?: string;
      industry?: string;
      search?: string;
      tags?: string[];
      created_after?: string;
      created_before?: string;
      sort?: string;
      order?: "asc" | "desc";
      fields?: string;
      expand?: string;
    };
    response: APIResponse<Customer[]>;
  };

  "GET /api/v1/{tenant_id}/crm/customers/{id}": {
    summary: "获取客户详情";
    params: { id: string };
    query: {
      expand?: string; // contacts,opportunities,orders
    };
    response: APIResponse<Customer>;
  };

  "POST /api/v1/{tenant_id}/crm/customers": {
    summary: "创建客户";
    request: {
      customer_code?: string;
      customer_name: string;
      customer_type: "individual" | "company";
      customer_level?: "vip" | "important" | "normal" | "general";
      industry?: string;

      // 联系信息
      primary_phone?: string;
      primary_email?: string;
      website?: string;

      // 地址信息
      primary_address?: Address;

      // 业务信息
      sales_rep_id?: string;
      customer_source?: string;
      credit_limit?: number;
      payment_terms?: number;

      // 标签和自定义字段
      tags?: string[];
      custom_fields?: Record<string, any>;
    };
    response: APIResponse<Customer>;
  };

  "PUT /api/v1/{tenant_id}/crm/customers/{id}": {
    summary: "更新客户";
    params: { id: string };
    request: Partial<Customer>;
    response: APIResponse<Customer>;
  };

  "DELETE /api/v1/{tenant_id}/crm/customers/{id}": {
    summary: "删除客户";
    params: { id: string };
    response: APIResponse<{}>;
  };

  // 客户联系人管理
  "GET /api/v1/{tenant_id}/crm/customers/{id}/contacts": {
    summary: "获取客户联系人";
    params: { id: string };
    response: APIResponse<Contact[]>;
  };

  "POST /api/v1/{tenant_id}/crm/customers/{id}/contacts": {
    summary: "添加客户联系人";
    params: { id: string };
    request: {
      first_name: string;
      last_name?: string;
      job_title?: string;
      mobile?: string;
      email?: string;
      is_primary?: boolean;
      is_decision_maker?: boolean;
    };
    response: APIResponse<Contact>;
  };

  // 客户操作
  "POST /api/v1/{tenant_id}/crm/customers/{id}/actions/activate": {
    summary: "激活客户";
    params: { id: string };
    response: APIResponse<{}>;
  };

  "POST /api/v1/{tenant_id}/crm/customers/{id}/actions/assign": {
    summary: "分配销售代表";
    params: { id: string };
    request: {
      sales_rep_id: string;
      reason?: string;
    };
    response: APIResponse<{}>;
  };
}
```

### 9.2 销售机会 API

```typescript
// 销售机会 API
interface OpportunityAPIs {
  "GET /api/v1/{tenant_id}/crm/opportunities": {
    summary: "获取销售机会列表";
    query: {
      page?: number;
      limit?: number;
      status?: "open" | "won" | "lost" | "cancelled";
      stage_id?: string;
      sales_rep_id?: string;
      customer_id?: string;
      opportunity_type?: "new" | "existing" | "renewal" | "upsell";
      priority?: "low" | "medium" | "high" | "urgent";
      expected_close_after?: string;
      expected_close_before?: string;
      estimated_value_min?: number;
      estimated_value_max?: number;
      search?: string;
      sort?: string;
      order?: "asc" | "desc";
    };
    response: APIResponse<Opportunity[]>;
  };

  "GET /api/v1/{tenant_id}/crm/opportunities/{id}": {
    summary: "获取销售机会详情";
    params: { id: string };
    response: APIResponse<Opportunity>;
  };

  "POST /api/v1/{tenant_id}/crm/opportunities": {
    summary: "创建销售机会";
    request: {
      opportunity_name: string;
      customer_id: string;
      contact_id?: string;
      sales_rep_id: string;
      opportunity_type: "new" | "existing" | "renewal" | "upsell";
      estimated_value: number;
      currency_code?: string;
      probability?: number;
      expected_close_date?: string;
      stage_id: string;
      priority?: "low" | "medium" | "high" | "urgent";
      lead_source?: string;
      description?: string;
      custom_fields?: Record<string, any>;
    };
    response: APIResponse<Opportunity>;
  };

  "PUT /api/v1/{tenant_id}/crm/opportunities/{id}": {
    summary: "更新销售机会";
    params: { id: string };
    request: Partial<Opportunity>;
    response: APIResponse<Opportunity>;
  };

  // 销售机会操作
  "POST /api/v1/{tenant_id}/crm/opportunities/{id}/actions/advance-stage": {
    summary: "推进销售阶段";
    params: { id: string };
    request: {
      stage_id: string;
      notes?: string;
    };
    response: APIResponse<{}>;
  };

  "POST /api/v1/{tenant_id}/crm/opportunities/{id}/actions/close-won": {
    summary: "赢得销售机会";
    params: { id: string };
    request: {
      actual_close_value: number;
      close_date?: string;
      notes?: string;
    };
    response: APIResponse<{}>;
  };

  "POST /api/v1/{tenant_id}/crm/opportunities/{id}/actions/close-lost": {
    summary: "失去销售机会";
    params: { id: string };
    request: {
      close_reason: string;
      lost_to_competitor?: string;
      notes?: string;
    };
    response: APIResponse<{}>;
  };
}
```

---

## 10. 性能优化

### 10.1 缓存策略

```typescript
// 缓存配置
interface CacheStrategy {
  // HTTP 缓存头
  cache_control: {
    public_resources: "public, max-age=3600";     // 公共资源1小时
    user_data: "private, max-age=300";            // 用户数据5分钟
    real_time_data: "no-cache, must-revalidate"; // 实时数据不缓存
  };

  // ETag 支持
  etag: {
    enabled: boolean;
    header: "ETag";
    if_none_match: "If-None-Match";
  };

  // Redis 缓存
  redis_cache: {
    user_sessions: "user:session:{user_id}";     // 用户会话
    user_permissions: "user:perms:{user_id}";    // 用户权限
    tenant_config: "tenant:config:{tenant_id}"; // 租户配置
    lookup_data: "lookup:{type}";                // 查找数据
  };

  // 应用层缓存
  memory_cache: {
    permissions: "5分钟";
    configurations: "10分钟";
    static_data: "1小时";
  };
}

// 缓存键命名规范
const cacheKeyPatterns = {
  user: "user:{user_id}",
  customer: "customer:{tenant_id}:{customer_id}",
  opportunity: "opportunity:{tenant_id}:{opportunity_id}",
  customer_list: "customers:{tenant_id}:{hash}",
  search_results: "search:{tenant_id}:{query_hash}"
};
```

### 10.2 性能监控

```typescript
// 性能指标
interface PerformanceMetrics {
  // 响应时间指标
  response_time: {
    p50: number;      // 50百分位响应时间
    p95: number;      // 95百分位响应时间
    p99: number;      // 99百分位响应时间
    max: number;      // 最大响应时间
  };

  // 吞吐量指标
  throughput: {
    requests_per_second: number;    // 每秒请求数
    concurrent_requests: number;    // 并发请求数
    queue_length: number;          // 队列长度
  };

  // 错误率指标
  error_rate: {
    total_errors: number;          // 总错误数
    error_percentage: number;      // 错误百分比
    by_status_code: Record<number, number>; // 按状态码分组
  };

  // 资源使用指标
  resource_usage: {
    cpu_usage: number;             // CPU使用率
    memory_usage: number;          // 内存使用率
    database_connections: number;  // 数据库连接数
    cache_hit_rate: number;        // 缓存命中率
  };
}
```

---

## 总结

这个 API 规范提供了完整的 ERP 系统接口设计方案：

### 🔧 核心特性
1. **统一规范** - 一致的URL格式、命名、响应结构
2. **RESTful 设计** - 标准的HTTP语义和资源设计
3. **多租户支持** - 完整的租户隔离和权限控制
4. **性能优化** - 缓存策略、批量操作、分页查询

### 🛡️ 安全保障
- JWT 认证授权
- 细粒度权限控制
- 输入验证和输出过滤
- 请求频率限制

### 📈 可扩展性
- 版本管理策略
- 模块化API设计
- 插件接口支持
- 第三方集成能力

### 🎯 开发友好
- 清晰的接口文档
- 一致的错误信息
- 完整的示例代码
- 性能监控指标

URL 格式已按您的要求修改为：`https://erp.com/api/v1/{tenant_id}/{module}/{resource}`