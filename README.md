# Go ERP - 企业级资源管理系统

## 项目概述

Go ERP 是一个基于微服务架构的现代化企业资源管理系统，采用前后端分离设计，支持多租户、模块化插件、AI 智能助手等特性。

### 技术栈

**前端技术栈**
- React 18 + TypeScript 5
- Next.js 14 (App Router)
- Ant Design 5.x + TailwindCSS
- Zustand (状态管理)
- React Query (服务端状态)

**后端技术栈**
- Go 1.24+
- Kratos Framework (微服务框架)
- PostgreSQL 15+ (主数据库)
- Redis 7+ (缓存/会话)
- gRPC (服务间通信)

**基础设施**
- Docker + Docker Compose
- Kubernetes (生产环境)
- Jaeger (链路追踪)
- Prometheus + Grafana (监控)

## 项目结构

```
go-erp/
├── apps/                   # 前端应用
│   ├── web/               # Web 管理后台
│   ├── mobile/            # 移动端应用
│   └── admin/             # 系统管理端
├── services/              # 后端微服务
│   ├── auth/              # 认证服务
│   ├── user/              # 用户服务
│   ├── crm/               # CRM 服务
│   └── gateway/           # API 网关
├── packages/              # 共享包
│   ├── ui/                # UI 组件库
│   ├── utils/             # 工具函数
│   └── types/             # 类型定义
├── scripts/               # 开发脚本
├── docs/                  # 项目文档
└── tools/                 # 开发工具
```

## 快速开始

### 环境要求

- Node.js 18+
- Go 1.24+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 安装依赖

```bash
# 安装前端依赖
cd apps/web
npm install

# 安装 Go 依赖
cd services/auth
go mod tidy
```

### 启动开发环境

```bash
# 一键启动完整开发环境
./scripts/dev-start.sh

# 或者分步启动

# 1. 启动基础设施服务
docker-compose -f docker-compose.dev.yml up -d postgres redis

# 2. 启动前端
cd apps/web
npm run dev

# 3. 启动后端服务
cd services/auth
go run cmd/main.go
```

### 访问应用

- **前端应用**: http://localhost:50000
- **API 网关**: http://localhost:50003
- **认证服务**: http://localhost:50004
- **Grafana**: http://localhost:50010 (admin/admin)
- **Jaeger**: http://localhost:50012
- **RabbitMQ 管理**: http://localhost:50014 (erp_user/erp_password)
- **MinIO 控制台**: http://localhost:50016 (minioadmin/minioadmin)

### 默认登录信息

```
租户代码: demo
用户名: admin
密码: admin123
```

## 功能模块

### ✅ 已完成
- [x] 项目架构设计
- [x] 前端基础框架 (React + Next.js + Ant Design)
- [x] 认证系统界面
- [x] 主布局和导航
- [x] 仪表板页面
- [x] CRM 客户管理
- [x] CRM 商机管理
- [x] 后端服务结构

### 🚧 开发中
- [ ] 后端 API 实现
- [ ] 数据库集成
- [ ] 用户权限系统
- [ ] 文件上传管理

### 📋 待开发
- [ ] 移动端应用
- [ ] 系统管理模块
- [ ] 报表分析
- [ ] AI 智能助手
- [ ] 插件市场

## 开发指南

### 前端开发

```bash
cd apps/web

# 启动开发服务器
npm run dev

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

### 后端开发

```bash
cd services/auth

# 运行服务
go run cmd/main.go

# 运行测试
go test ./...

# 构建二进制文件
go build -o bin/auth cmd/main.go
```

### 数据库管理

```bash
# 运行迁移
migrate -path migrations -database "postgres://erp_user:erp_password@localhost:50001/erp_auth?sslmode=disable" up

# 回滚迁移
migrate -path migrations -database "postgres://erp_user:erp_password@localhost:50001/erp_auth?sslmode=disable" down 1
```

## API 文档

### 认证相关 API

```bash
# 用户登录
POST /api/v1/auth/login
{
  "username": "admin",
  "password": "admin123",
  "tenant_code": "demo"
}

# 刷新令牌
POST /api/v1/auth/refresh
{
  "refresh_token": "xxx"
}

# 用户注销
POST /api/v1/auth/logout
```

### CRM 相关 API

```bash
# 获取客户列表
GET /api/v1/{tenant_id}/crm/customers

# 创建客户
POST /api/v1/{tenant_id}/crm/customers

# 获取商机列表
GET /api/v1/{tenant_id}/crm/opportunities
```

## 部署指南

### 开发环境

```bash
# 使用 Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

### 生产环境

```bash
# 使用 Kubernetes
kubectl apply -f deploy/k8s/
```

## 贡献指南

### 开发流程

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/web-user-login`)
3. 提交更改（遵循提交规范）
4. 推送到分支 (`git push origin feature/web-user-login`)
5. 打开 Pull Request

### 提交规范

为确保项目历史清晰，请遵循统一的提交规范：

```bash
# 基本格式
<type>(<scope>): <subject>

# 示例
feat(web): 添加用户登录页面
fix(auth): 修复JWT令牌过期处理
docs: 更新API文档
```

**常用提交类型：**
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具配置

详细提交规范请查看：**[Git提交规范文档](docs/GIT_COMMIT_GUIDELINES.md)**

## 端口分配

为避免端口冲突，本项目统一使用 50000-50050 端口范围：

### 核心服务端口
| 端口 | 服务 | 用途 |
|------|------|------|
| 50000 | 前端应用 | React Web 界面 |
| 50001 | PostgreSQL | 主数据库 |
| 50002 | Redis | 缓存服务 |
| 50003 | API 网关 | 统一入口 |
| 50004-50006 | 微服务 HTTP | 认证/用户/CRM 服务 |
| 50007-50009 | 微服务 gRPC | 内部通信 |
| 50010-50016 | 开发工具 | 监控/日志/存储 |

详细端口分配请查看：[docs/PORT_ALLOCATION.md](docs/PORT_ALLOCATION.md)

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系我们

- 项目主页: https://github.com/go-erp/go-erp
- 文档站点: https://docs.go-erp.com
- 问题反馈: https://github.com/go-erp/go-erp/issues