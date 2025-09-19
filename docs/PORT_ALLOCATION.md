# ERP 系统端口分配文档

## 概述

本文档记录了 Go ERP 系统在开发和生产环境中的端口分配方案，确保所有服务端口不冲突，并为未来扩展预留空间。

## 端口分配原则

1. **统一范围**: 所有 ERP 相关服务使用 50000-50050 端口范围
2. **分类管理**: 按服务类型分配连续端口段
3. **环境隔离**: 开发、测试、生产环境使用相同端口，通过容器网络隔离
4. **预留扩展**: 为未来模块和服务预留端口空间

## 当前端口分配表

### 核心服务 (50000-50019)

| 端口 | 服务名称 | 服务类型 | 协议 | 描述 |
|------|----------|----------|------|------|
| 50000 | web-frontend | 前端应用 | HTTP | React Web 前端应用 |
| 50001 | postgresql | 数据库 | TCP | PostgreSQL 主数据库 |
| 50002 | redis | 缓存 | TCP | Redis 缓存和会话存储 |
| 50003 | gateway | API网关 | HTTP | 统一API网关入口 |
| 50004 | auth-service | 认证服务 | HTTP | 用户认证和授权服务 |
| 50005 | user-service | 用户服务 | HTTP | 用户信息管理服务 |
| 50006 | crm-service | CRM服务 | HTTP | 客户关系管理服务 |
| 50007 | auth-grpc | 认证服务 | gRPC | 认证服务 gRPC 接口 |
| 50008 | user-grpc | 用户服务 | gRPC | 用户服务 gRPC 接口 |
| 50009 | crm-grpc | CRM服务 | gRPC | CRM服务 gRPC 接口 |
| 50010 | grafana | 监控工具 | HTTP | Grafana 可视化面板 |
| 50011 | prometheus | 监控工具 | HTTP | Prometheus 指标收集 |
| 50012 | jaeger | 链路追踪 | HTTP | Jaeger 分布式追踪 |
| 50013 | rabbitmq | 消息队列 | AMQP | RabbitMQ 消息队列 |
| 50014 | rabbitmq-mgmt | 消息队列 | HTTP | RabbitMQ 管理界面 |
| 50015 | minio-api | 对象存储 | HTTP | MinIO S3 兼容API |
| 50016 | minio-console | 对象存储 | HTTP | MinIO 管理控制台 |
| 50017 | mobile-app | 移动应用 | HTTP | React Native 移动端 |
| 50018 | admin-portal | 管理后台 | HTTP | 系统管理后台 |
| 50019 | websocket | 实时通信 | WebSocket | 实时消息推送服务 |

### 业务模块扩展 (50020-50029)

| 端口 | 预留用途 | 描述 |
|------|----------|------|
| 50020 | finance-service | 财务管理服务 |
| 50021 | inventory-service | 库存管理服务 |
| 50022 | purchase-service | 采购管理服务 |
| 50023 | sales-service | 销售管理服务 |
| 50024 | hr-service | 人力资源服务 |
| 50025 | ai-assistant | AI 智能助手服务 |
| 50026 | ml-engine | 机器学习引擎 |
| 50027 | ocr-service | OCR 识别服务 |
| 50028 | nlp-service | 自然语言处理 |
| 50029 | recommendation | 智能推荐服务 |

### 分析和报表 (50030-50039)

| 端口 | 预留用途 | 描述 |
|------|----------|------|
| 50030 | report-service | 报表生成服务 |
| 50031 | analytics-service | 数据分析服务 |
| 50032 | dashboard-api | 仪表板 API 服务 |
| 50033 | export-service | 数据导出服务 |
| 50034 | etl-service | ETL 数据处理 |
| 50035 | notification-service | 通知推送服务 |
| 50036 | email-service | 邮件发送服务 |
| 50037 | sms-service | 短信发送服务 |
| 50038 | webhook-service | Webhook 服务 |
| 50039 | scheduler-service | 定时任务服务 |

### 开发和测试 (50040-50050)

| 端口 | 预留用途 | 描述 |
|------|----------|------|
| 50040 | test-frontend | 测试环境前端 |
| 50041 | test-backend | 测试环境后端 |
| 50042 | mock-service | API Mock 服务 |
| 50043 | e2e-runner | E2E 测试运行器 |
| 50044 | load-tester | 负载测试工具 |
| 50045 | dev-proxy | 开发代理服务 |
| 50046 | hot-reload | 热重载服务 |
| 50047 | debug-server | 调试服务器 |
| 50048 | log-viewer | 日志查看器 |
| 50049 | health-check | 健康检查服务 |
| 50050 | temp-debug | 临时调试端口 |

## 环境配置

### 开发环境
- 所有服务运行在 localhost
- 使用 Docker Compose 统一管理
- 端口直接映射到宿主机

### 测试环境
- 使用相同端口配置
- 通过 Docker 网络隔离
- 可以并行运行多套测试环境

### 生产环境
- 使用 Kubernetes 服务发现
- 端口仅在集群内暴露
- 外部访问通过 Ingress 控制器

## 端口冲突检查

### 开发启动前检查
```bash
# 检查端口占用脚本
./scripts/check-ports.sh 50000-50050
```

### 常见冲突端口
避免使用以下常见端口：
- 3000-3010: 常见前端开发服务器
- 8000-8080: 常见后端服务
- 9000-9100: 常见监控工具
- 5432: 默认 PostgreSQL
- 6379: 默认 Redis
- 3306: 默认 MySQL

## 安全注意事项

1. **生产环境**: 数据库和缓存端口不应暴露到公网
2. **防火墙**: 配置防火墙规则限制端口访问
3. **监控**: 定期检查端口使用情况
4. **文档更新**: 新增服务时及时更新本文档

## 访问地址速查

### 开发环境访问地址
```
前端应用:        http://localhost:50000
API网关:         http://localhost:50003
Grafana:        http://localhost:50010 (admin/admin)
Jaeger:         http://localhost:50012
RabbitMQ管理:    http://localhost:50014 (erp_user/erp_password)
MinIO控制台:     http://localhost:50016 (minioadmin/minioadmin)
```

### 健康检查端点
```
认证服务:        http://localhost:50004/health
用户服务:        http://localhost:50005/health
CRM服务:        http://localhost:50006/health
```

## 变更记录

| 日期 | 版本 | 变更内容 | 操作人 |
|------|------|----------|--------|
| 2024-12-20 | v1.0 | 初始端口分配方案 | ERP Team |

## 联系方式

如需申请新端口或报告端口冲突，请：
1. 提交 Issue 到项目仓库
2. 联系系统架构师
3. 更新本文档并提交 PR

---

**重要提醒**: 修改端口配置后，请同时更新以下文件：
- `docker-compose.dev.yml`
- `apps/web/package.json`
- `services/*/configs/config.yaml`
- `README.md`
- `scripts/dev-start.sh`