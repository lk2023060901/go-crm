# ERP 系统项目结构设计

## 目录
1. [项目架构概览](#1-项目架构概览)
2. [前端项目结构](#2-前端项目结构)
3. [后端项目结构](#3-后端项目结构)
4. [开发环境配置](#4-开发环境配置)
5. [构建和部署](#5-构建和部署)
6. [开发规范](#6-开发规范)

---

## 1. 项目架构概览

### 1.1 技术栈选择

```
项目技术栈
├── 后端技术栈
│   ├── Go 1.24+ (主要语言)
│   ├── Kratos Framework (微服务框架)
│   ├── PostgreSQL 15+ (主数据库)
│   ├── Redis 7+ (缓存/会话)
│   ├── gRPC (服务间通信)
│   └── Docker (容器化)
├── 前端技术栈
│   ├── React 18 + TypeScript 5
│   ├── Next.js 14 (SSR/SSG)
│   ├── Ant Design 5.x (UI组件)
│   ├── TailwindCSS (样式方案)
│   ├── Zustand (状态管理)
│   ├── React Query (服务端状态)
│   └── Vite (构建工具)
├── 多端应用
│   ├── React Native (移动应用)
│   ├── Taro 3.x (小程序)
│   ├── Electron (桌面应用)
│   └── PWA (渐进式应用)
└── 基础设施
    ├── Kubernetes (容器编排)
    ├── Docker Compose (本地开发)
    ├── GitLab CI/CD (持续集成)
    ├── Nginx (负载均衡)
    └── Prometheus + Grafana (监控)
```

### 1.2 单体仓库 vs 多仓库策略

```
推荐采用 Monorepo 单体仓库架构：

优势：
✅ 统一版本管理和发布
✅ 代码共享和重用
✅ 统一的开发工具和规范
✅ 简化依赖管理
✅ 跨项目重构更容易

目录结构：
go-erp/
├── apps/              # 应用程序
│   ├── web/           # Web前端应用
│   ├── mobile/        # 移动端应用
│   ├── admin/         # 管理后台
│   └── desktop/       # 桌面应用
├── services/          # 后端服务
│   ├── auth/          # 认证服务
│   ├── user/          # 用户服务
│   ├── crm/           # CRM服务
│   ├── gateway/       # API网关
│   └── notification/  # 通知服务
├── packages/          # 共享包
│   ├── ui/            # UI组件库
│   ├── utils/         # 工具函数
│   ├── types/         # 类型定义
│   └── config/        # 配置管理
└── tools/             # 开发工具
    ├── build/         # 构建脚本
    ├── deploy/        # 部署脚本
    └── scripts/       # 辅助脚本
```

---

## 2. 前端项目结构

### 2.1 Web 前端应用结构

```
apps/web/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── (auth)/             # 认证相关页面组
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── [tenant]/           # 动态租户路由
│   │   │   ├── dashboard/      # 仪表板
│   │   │   ├── crm/           # CRM模块
│   │   │   │   ├── customers/
│   │   │   │   ├── opportunities/
│   │   │   │   └── layout.tsx
│   │   │   ├── system/        # 系统管理
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   └── organizations/
│   │   │   └── layout.tsx
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── upload/
│   │   │   └── webhook/
│   │   ├── globals.css
│   │   ├── layout.tsx         # 根布局
│   │   ├── loading.tsx        # 全局加载页
│   │   ├── error.tsx          # 全局错误页
│   │   ├── not-found.tsx      # 404页面
│   │   └── page.tsx           # 首页
│   ├── components/            # 组件
│   │   ├── ui/                # 基础UI组件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── modal.tsx
│   │   │   └── index.ts
│   │   ├── forms/             # 表单组件
│   │   │   ├── user-form.tsx
│   │   │   ├── customer-form.tsx
│   │   │   └── index.ts
│   │   ├── layouts/           # 布局组件
│   │   │   ├── main-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── sidebar.tsx
│   │   ├── charts/            # 图表组件
│   │   │   ├── line-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   └── pie-chart.tsx
│   │   └── features/          # 功能组件
│   │       ├── auth/
│   │       ├── crm/
│   │       └── dashboard/
│   ├── hooks/                 # 自定义Hooks
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   ├── use-permissions.ts
│   │   └── use-tenant.ts
│   ├── lib/                   # 工具库
│   │   ├── api/               # API客户端
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── crm.ts
│   │   │   └── types.ts
│   │   ├── auth/              # 认证相关
│   │   │   ├── config.ts
│   │   │   ├── middleware.ts
│   │   │   └── utils.ts
│   │   ├── utils/             # 工具函数
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   ├── date.ts
│   │   │   └── constants.ts
│   │   └── stores/            # 状态管理
│   │       ├── auth-store.ts
│   │       ├── user-store.ts
│   │       └── tenant-store.ts
│   ├── styles/                # 样式文件
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── tailwind.css
│   └── types/                 # 类型定义
│       ├── api.ts
│       ├── auth.ts
│       ├── user.ts
│       └── global.d.ts
├── .env.example               # 环境变量示例
├── .env.local                 # 本地环境变量
├── .eslintrc.json             # ESLint配置
├── .gitignore
├── next.config.js             # Next.js配置
├── package.json
├── tailwind.config.js         # TailwindCSS配置
├── tsconfig.json              # TypeScript配置
└── README.md
```

### 2.2 移动端应用结构

```
apps/mobile/
├── src/
│   ├── screens/               # 页面
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── crm/
│   │   │   ├── CustomerListScreen.tsx
│   │   │   ├── CustomerDetailScreen.tsx
│   │   │   └── OpportunityScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── components/            # 组件
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loading.tsx
│   │   ├── forms/
│   │   └── charts/
│   ├── navigation/            # 导航
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/              # 服务
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── stores/                # 状态管理
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   ├── utils/                 # 工具函数
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   └── types/                 # 类型定义
│       ├── api.ts
│       └── navigation.ts
├── android/                   # Android配置
├── ios/                       # iOS配置
├── .env.example
├── app.json                   # Expo配置
├── babel.config.js
├── metro.config.js
├── package.json
└── tsconfig.json
```

### 2.3 小程序应用结构

```
apps/miniprogram/
├── src/
│   ├── pages/                 # 页面
│   │   ├── index/
│   │   │   ├── index.tsx
│   │   │   ├── index.scss
│   │   │   └── index.config.ts
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── customers/
│   │   └── profile/
│   ├── components/            # 组件
│   │   ├── common/
│   │   ├── forms/
│   │   └── charts/
│   ├── services/              # 服务
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── request.ts
│   ├── stores/                # 状态管理
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   └── user.ts
│   ├── utils/                 # 工具函数
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── storage.ts
│   └── types/                 # 类型定义
│       └── index.ts
├── config/                    # 配置文件
│   ├── dev.ts
│   ├── prod.ts
│   └── index.ts
├── .env.example
├── app.config.ts              # 应用配置
├── babel.config.js
├── package.json
├── project.config.json        # 小程序配置
└── tsconfig.json
```

---

## 3. 后端项目结构

### 3.1 Kratos 微服务结构

```
services/
├── auth/                      # 认证服务
│   ├── api/                   # API定义
│   │   └── v1/
│   │       ├── auth.proto
│   │       └── auth.pb.go
│   ├── internal/              # 内部代码
│   │   ├── biz/               # 业务逻辑层
│   │   │   ├── auth.go
│   │   │   ├── user.go
│   │   │   └── biz.go
│   │   ├── data/              # 数据访问层
│   │   │   ├── auth.go
│   │   │   ├── user.go
│   │   │   └── data.go
│   │   ├── service/           # 服务层
│   │   │   ├── auth.go
│   │   │   └── service.go
│   │   ├── server/            # 服务器配置
│   │   │   ├── grpc.go
│   │   │   ├── http.go
│   │   │   └── server.go
│   │   └── conf/              # 配置
│   │       ├── conf.proto
│   │       └── conf.pb.go
│   ├── configs/               # 配置文件
│   │   ├── config.yaml
│   │   ├── config-dev.yaml
│   │   └── config-prod.yaml
│   ├── cmd/                   # 入口文件
│   │   └── main.go
│   ├── migrations/            # 数据库迁移
│   │   ├── 001_init.up.sql
│   │   └── 001_init.down.sql
│   ├── pkg/                   # 公共包
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── errors/
│   ├── test/                  # 测试文件
│   │   ├── integration/
│   │   └── unit/
│   ├── scripts/               # 脚本文件
│   │   ├── build.sh
│   │   └── run.sh
│   ├── Dockerfile
│   ├── Makefile
│   ├── go.mod
│   ├── go.sum
│   └── README.md
├── user/                      # 用户服务
├── crm/                       # CRM服务
├── gateway/                   # API网关
└── shared/                    # 共享代码
    ├── pkg/                   # 共享包
    │   ├── auth/              # 认证中间件
    │   ├── database/          # 数据库工具
    │   ├── redis/             # Redis工具
    │   ├── logger/            # 日志工具
    │   ├── metrics/           # 监控指标
    │   └── errors/            # 错误处理
    └── proto/                 # 共享Proto文件
        ├── common/
        └── types/
```

### 3.2 数据库迁移结构

```
migrations/
├── auth/                      # 认证服务迁移
│   ├── 001_init_tables.up.sql
│   ├── 001_init_tables.down.sql
│   ├── 002_add_2fa_support.up.sql
│   └── 002_add_2fa_support.down.sql
├── user/                      # 用户服务迁移
│   ├── 001_init_tables.up.sql
│   ├── 001_init_tables.down.sql
│   ├── 002_add_user_profile.up.sql
│   └── 002_add_user_profile.down.sql
├── crm/                       # CRM服务迁移
│   ├── 001_init_tables.up.sql
│   ├── 001_init_tables.down.sql
│   ├── 002_add_opportunities.up.sql
│   └── 002_add_opportunities.down.sql
└── shared/                    # 共享迁移
    ├── 001_init_tenants.up.sql
    ├── 001_init_tenants.down.sql
    ├── 002_add_audit_logs.up.sql
    └── 002_add_audit_logs.down.sql
```

---

## 4. 开发环境配置

### 4.1 Docker 开发环境

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # 数据库服务
  postgres:
    image: postgres:15-alpine
    container_name: erp-postgres
    environment:
      POSTGRES_DB: erp_dev
      POSTGRES_USER: erp_user
      POSTGRES_PASSWORD: erp_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql

  # Redis缓存
  redis:
    image: redis:7-alpine
    container_name: erp-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # 消息队列
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: erp-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: erp_user
      RABBITMQ_DEFAULT_PASS: erp_password
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  # Elasticsearch
  elasticsearch:
    image: elasticsearch:8.10.0
    container_name: erp-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data

  # 监控服务
  prometheus:
    image: prom/prometheus:latest
    container_name: erp-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./configs/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    container_name: erp-grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
  es_data:
  grafana_data:
```

### 4.2 开发工具配置

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "go.toolsManagement.autoUpdate": true,
  "go.formatTool": "goimports",
  "go.lintTool": "golangci-lint",
  "go.testFlags": ["-v"],
  "files.associations": {
    "*.proto": "proto3"
  },
  "eslint.workingDirectories": [
    "apps/web",
    "apps/mobile",
    "apps/miniprogram"
  ]
}

// .vscode/extensions.json
{
  "recommendations": [
    "golang.go",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "zxh404.vscode-proto3",
    "ms-vscode.docker",
    "ms-kubernetes-tools.vscode-kubernetes-tools"
  ]
}
```

### 4.3 环境变量配置

```bash
# .env.example
# 应用配置
APP_NAME=ERP System
APP_ENV=development
APP_PORT=8080
APP_DEBUG=true

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=erp_dev
DB_USER=erp_user
DB_PASSWORD=erp_password
DB_SSL_MODE=disable

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# 第三方服务配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# 对象存储配置
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=erp-storage

# 监控配置
PROMETHEUS_ENDPOINT=http://localhost:9090
JAEGER_ENDPOINT=http://localhost:14268/api/traces

# 日志配置
LOG_LEVEL=debug
LOG_FORMAT=json
LOG_OUTPUT=stdout
```

---

## 5. 构建和部署

### 5.1 构建脚本

```bash
#!/bin/bash
# scripts/build.sh

set -e

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# 构建参数
BUILD_VERSION=${BUILD_VERSION:-"dev"}
BUILD_COMMIT=${BUILD_COMMIT:-$(git rev-parse --short HEAD)}
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "Building ERP System..."
echo "Version: $BUILD_VERSION"
echo "Commit: $BUILD_COMMIT"
echo "Build Time: $BUILD_TIME"

# 构建前端应用
echo "Building Web App..."
cd apps/web
npm run build
cd "$PROJECT_ROOT"

echo "Building Mobile App..."
cd apps/mobile
npm run build:android
npm run build:ios
cd "$PROJECT_ROOT"

# 构建后端服务
echo "Building Auth Service..."
cd services/auth
go build -ldflags "-X main.version=$BUILD_VERSION -X main.commit=$BUILD_COMMIT -X main.buildTime=$BUILD_TIME" -o bin/auth cmd/main.go
cd "$PROJECT_ROOT"

echo "Building User Service..."
cd services/user
go build -ldflags "-X main.version=$BUILD_VERSION -X main.commit=$BUILD_COMMIT -X main.buildTime=$BUILD_TIME" -o bin/user cmd/main.go
cd "$PROJECT_ROOT"

echo "Building CRM Service..."
cd services/crm
go build -ldflags "-X main.version=$BUILD_VERSION -X main.commit=$BUILD_COMMIT -X main.buildTime=$BUILD_TIME" -o bin/crm cmd/main.go
cd "$PROJECT_ROOT"

echo "Build completed successfully!"
```

### 5.2 Docker 构建

```dockerfile
# services/auth/Dockerfile
FROM golang:1.24-alpine AS builder

WORKDIR /app

# 安装依赖
RUN apk add --no-cache git ca-certificates tzdata

# 复制依赖文件
COPY go.mod go.sum ./
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/main.go

# 最终镜像
FROM alpine:latest

# 安装ca证书
RUN apk --no-cache add ca-certificates
WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/configs ./configs

# 暴露端口
EXPOSE 8080 9090

# 运行应用
CMD ["./main"]
```

### 5.3 Kubernetes 部署

```yaml
# deploy/auth-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: erp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: erp/auth-service:latest
        ports:
        - containerPort: 8080
          name: http
        - containerPort: 9090
          name: grpc
        env:
        - name: DB_HOST
          value: "postgres-service"
        - name: REDIS_HOST
          value: "redis-service"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: erp-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: erp
spec:
  selector:
    app: auth-service
  ports:
  - name: http
    port: 80
    targetPort: 8080
  - name: grpc
    port: 9090
    targetPort: 9090
```

---

## 6. 开发规范

### 6.1 代码规范

```typescript
// 前端代码规范

// 1. 组件命名：PascalCase
export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

// 2. Hook命名：use开头，camelCase
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  return { user, setUser };
};

// 3. 常量命名：UPPER_SNAKE_CASE
export const API_ENDPOINTS = {
  USERS: '/api/v1/users',
  CUSTOMERS: '/api/v1/customers'
} as const;

// 4. 类型定义：PascalCase
export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// 5. 枚举命名：PascalCase
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}
```

```go
// 后端代码规范

// 1. 包命名：小写
package auth

// 2. 结构体命名：PascalCase
type User struct {
    ID       uuid.UUID `json:"id" db:"id"`
    Username string    `json:"username" db:"username"`
    Email    string    `json:"email" db:"email"`
}

// 3. 接口命名：以er结尾
type UserRepository interface {
    Create(ctx context.Context, user *User) error
    GetByID(ctx context.Context, id uuid.UUID) (*User, error)
    Update(ctx context.Context, user *User) error
    Delete(ctx context.Context, id uuid.UUID) error
}

// 4. 方法命名：PascalCase
func (r *userRepository) CreateUser(ctx context.Context, user *User) error {
    // implementation
    return nil
}

// 5. 常量命名：PascalCase或全大写
const (
    DefaultPageSize = 20
    MaxPageSize     = 100
)
```

### 6.2 Git 工作流

```bash
# Git分支命名规范
main                    # 主分支
develop                 # 开发分支
feature/user-auth      # 功能分支
hotfix/login-bug       # 热修复分支
release/v1.0.0         # 发布分支

# 提交信息规范
feat: 新增用户认证功能
fix: 修复登录页面验证码显示问题
docs: 更新API文档
style: 格式化代码
refactor: 重构用户服务架构
test: 添加用户登录测试用例
chore: 更新依赖包版本

# 提交信息模板
<type>(<scope>): <subject>

<body>

<footer>

# 示例
feat(auth): 添加JWT令牌刷新功能

- 实现刷新令牌机制
- 添加令牌过期检查
- 更新认证中间件

Closes #123
```

### 6.3 测试规范

```typescript
// 前端测试示例
// components/__tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from '../UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles missing user gracefully', () => {
    render(<UserProfile user={null} />);

    expect(screen.getByText('No user found')).toBeInTheDocument();
  });
});
```

```go
// 后端测试示例
// internal/service/auth_test.go
package service

import (
    "context"
    "testing"
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

func TestAuthService_Login(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    authService := NewAuthService(mockRepo)

    user := &User{
        ID:       uuid.New(),
        Username: "testuser",
        Email:    "test@example.com",
    }

    mockRepo.On("GetByUsername", mock.Anything, "testuser").Return(user, nil)

    // Act
    result, err := authService.Login(context.Background(), "testuser", "password")

    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, result)
    assert.Equal(t, user.ID, result.UserID)
    mockRepo.AssertExpectations(t)
}
```

### 6.4 文档规范

```markdown
# API文档示例

## 创建用户

### 接口描述
创建新的用户账户

### 请求方式
POST /api/v1/{tenant_id}/system/users

### 请求参数
| 参数名 | 类型 | 必选 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名，3-50个字符 |
| email | string | 是 | 邮箱地址 |
| first_name | string | 是 | 名字 |
| last_name | string | 否 | 姓氏 |
| org_id | string | 是 | 组织ID |

### 请求示例
```json
{
  "username": "zhangsan",
  "email": "zhangsan@example.com",
  "first_name": "三",
  "last_name": "张",
  "org_id": "uuid-1234"
}
```

### 响应示例
```json
{
  "code": 200,
  "message": "用户创建成功",
  "data": {
    "id": "uuid-5678",
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "full_name": "张三",
    "status": "active",
    "created_at": "2024-12-20T10:30:00Z"
  }
}
```

### 错误码说明
| 错误码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 409 | 用户名或邮箱已存在 |
| 422 | 数据验证失败 |
```

---

## 总结

这个项目结构设计提供了：

### 🏗️ 架构优势
1. **Monorepo管理** - 统一的代码管理和版本控制
2. **微服务架构** - 服务独立、可扩展、易维护
3. **多端支持** - Web、Mobile、小程序、桌面端
4. **模块化设计** - 清晰的目录结构和职责分离

### 🛠️ 开发体验
1. **统一的开发环境** - Docker Compose一键启动
2. **自动化构建** - 统一的构建和部署脚本
3. **代码规范** - ESLint、Prettier、Go fmt
4. **完整的测试** - 单元测试、集成测试、E2E测试

### 🚀 部署支持
1. **容器化部署** - Docker + Kubernetes
2. **CI/CD流水线** - 自动化测试和部署
3. **监控体系** - Prometheus + Grafana
4. **环境隔离** - 开发、测试、生产环境分离

这为快速开发和维护 ERP 系统提供了坚实的基础！