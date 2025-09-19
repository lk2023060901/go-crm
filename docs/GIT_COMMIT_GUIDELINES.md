# Git 提交规范

## 概述

本文档定义了 Go ERP Monorepo 项目的 Git 提交规范，旨在确保提交历史清晰、一致且便于团队协作。

## 提交消息格式

### 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 字段说明

- **type**: 提交类型（必填）
- **scope**: 影响范围（推荐）
- **subject**: 简短描述（必填）
- **body**: 详细描述（可选）
- **footer**: 页脚信息（可选）

## Type 类型

| 类型 | 说明 | 使用场景 |
|------|------|----------|
| `feat` | 新功能 | 添加新功能、新页面、新模块 |
| `fix` | Bug修复 | 修复缺陷、错误处理 |
| `perf` | 性能优化 | 提升性能、优化算法 |
| `refactor` | 重构代码 | 代码结构调整、逻辑优化 |
| `style` | 代码格式 | 格式化、缩进、空行调整 |
| `test` | 测试相关 | 添加/修改测试用例 |
| `docs` | 文档更新 | README、API文档、注释 |
| `chore` | 构建/工具 | 依赖更新、构建脚本、配置 |
| `ci` | CI/CD配置 | 持续集成、部署流程 |
| `revert` | 撤销提交 | 回滚之前的更改 |

## Scope 范围

### 前端应用模块
- `web` - Web管理后台
- `mobile` - 移动端应用
- `admin` - 系统管理端

### 后端服务模块
- `auth` - 认证服务
- `user` - 用户服务
- `crm` - CRM服务
- `gateway` - API网关

### 共享包模块
- `ui` - UI组件库
- `utils` - 工具函数
- `types` - 类型定义

### 基础设施模块
- `docker` - Docker配置
- `k8s` - Kubernetes部署
- `ci` - 持续集成
- `docs` - 项目文档
- `deps` - 依赖管理
- `config` - 配置文件
- `scripts` - 构建脚本

## 提交示例

### 功能开发

```bash
feat(web): 添加用户登录页面

- 实现用户名密码登录功能
- 添加"记住我"选项
- 集成租户代码自动识别
- 添加表单验证和错误提示

Closes #001
```

```bash
feat(crm): 实现客户管理模块

- 添加客户列表页面
- 实现客户信息的增删改查
- 集成客户搜索和筛选功能
- 添加客户状态管理

Closes #045
```

### Bug修复

```bash
fix(auth): 修复JWT令牌过期处理

修复用户令牌过期后无法自动刷新的问题：
- 添加令牌过期检测逻辑
- 实现自动刷新机制
- 处理刷新失败的降级策略

Fixes #123
```

```bash
fix(web): 解决登录页面黑屏问题

- 修复租户布局拦截认证页面的问题
- 添加认证路径检测逻辑
- 确保登录页面正常显示

Fixes #156
```

### 性能优化

```bash
perf(crm): 优化客户列表查询性能

- 实现分页查询，减少单次数据量
- 添加虚拟滚动支持大数据量展示
- 优化API调用，减少重复请求
- 添加客户端缓存机制

性能提升约60%，支持万级数据流畅展示
```

```bash
perf(web): 优化应用启动速度

- 实现路由懒加载
- 分离第三方依赖包
- 优化Webpack配置
- 减少初始bundle体积30%
```

### 重构

```bash
refactor(ui): 重构表单组件架构

- 分离表单逻辑和UI展示
- 统一表单验证规则
- 提取可复用的表单hooks
- 提升组件可测试性和可维护性
```

```bash
refactor(auth): 重构认证服务架构

- 分离认证逻辑和数据层
- 实现可插拔的认证策略
- 优化错误处理和日志记录
- 提升代码可扩展性
```

### 配置和工具

```bash
chore(deps): 升级React到18.3.1

- 解决Ant Design兼容性警告
- 更新相关类型定义文件
- 确保所有子包版本一致
- 验证生产环境稳定性

BREAKING CHANGE: 需要重新运行 npm install
```

```bash
chore: 配置代码提交规范工具

- 添加commitizen交互式提交
- 配置commitlint验证规则
- 设置pre-commit代码检查
- 更新开发者文档
```

### 文档更新

```bash
docs: 完善API文档和部署指南

- 添加认证API的详细说明
- 补充Docker部署步骤
- 更新端口分配表
- 添加常见问题解答

完善文档覆盖率，提升开发者体验
```

```bash
docs(crm): 添加CRM模块开发指南

- 编写客户管理API文档
- 添加前端组件使用示例
- 补充数据库设计说明
- 提供单元测试指导
```

### 测试相关

```bash
test(auth): 添加认证服务单元测试

- 覆盖登录/注册核心流程
- 添加JWT令牌处理测试
- 测试错误场景处理
- 提升测试覆盖率到85%
```

```bash
test(web): 补充登录页面测试用例

- 添加表单验证测试
- 测试用户交互流程
- 覆盖错误状态处理
- 集成端到端测试
```

## Monorepo 特殊约定

### 多模块变更

当一次提交涉及多个模块时，使用逗号分隔scope：

```bash
feat(web,auth): 实现SSO单点登录

Web端变更:
- 添加SSO登录按钮和页面
- 处理OAuth回调逻辑
- 集成第三方登录状态

Auth服务变更:
- 实现OAuth2.0协议集成
- 添加第三方用户信息同步
- 更新JWT令牌生成逻辑

Closes #078
```

### 全局影响的变更

```bash
chore: 统一项目依赖版本管理

影响模块: web, mobile, admin, auth, user, crm

- 升级所有React应用到18.3.1
- 统一TypeScript版本到5.x
- 更新Go依赖到最新稳定版
- 同步构建脚本和CI配置

BREAKING CHANGE:
- 需要重新安装所有依赖
- 更新本地开发环境配置
```

### 基础设施变更

```bash
ci: 优化Docker构建和部署流程

- 实现多阶段构建减少镜像体积
- 添加健康检查和优雅停机
- 优化缓存策略提升构建速度
- 集成安全扫描和漏洞检测

部署时间从15分钟缩短到5分钟
```

## 分支命名规范

### 分支类型

```bash
# 功能开发
feature/web-user-login
feature/crm-customer-management

# Bug修复
bugfix/auth-token-refresh
bugfix/web-login-blackscreen

# 紧急修复
hotfix/crm-data-loss
hotfix/security-vulnerability

# 代码重构
refactor/ui-components
refactor/auth-architecture

# 文档更新
docs/api-documentation
docs/deployment-guide
```

### 分支命名原则

- 使用小写字母和连字符
- 包含模块前缀便于识别
- 描述清晰且具体
- 避免使用特殊字符

## 提交最佳实践

### 1. 提交频率
- 小步快跑，频繁提交
- 每个提交专注单一变更
- 避免混合不同类型的修改

### 2. 提交内容
- 确保代码能够编译通过
- 包含相关的测试用例
- 更新对应的文档

### 3. 提交描述
- 使用现在时态："添加功能"而非"添加了功能"
- 简洁明确，突出重点
- 必要时在body中详细说明

### 4. 团队协作
- 提交前同步最新代码
- 解决冲突后再提交
- 大功能分解为多个小提交

## 工具集成

### Commitizen 配置

安装和配置交互式提交工具：

```bash
# 安装依赖
npm install -g commitizen cz-conventional-changelog

# 项目配置
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# 使用方式
git add .
git cz
```

### Commitlint 规则

配置提交消息验证：

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'perf', 'refactor', 'style',
      'test', 'docs', 'chore', 'ci', 'revert'
    ]],
    'scope-enum': [2, 'always', [
      'web', 'mobile', 'admin', 'auth', 'user', 'crm', 'gateway',
      'ui', 'utils', 'types', 'docker', 'k8s', 'ci', 'docs'
    ]],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
};
```

### Git Hooks

设置pre-commit检查：

```bash
#!/bin/sh
# .git/hooks/pre-commit

# 代码格式检查
npm run lint

# 类型检查
npm run type-check

# 单元测试
npm run test:unit

# 提交消息检查
npx commitlint --edit $1
```

## 版本发布

基于提交类型自动生成版本：

- `feat`: 小版本号递增 (1.1.0 → 1.2.0)
- `fix`: 补丁版本号递增 (1.1.0 → 1.1.1)
- `BREAKING CHANGE`: 主版本号递增 (1.1.0 → 2.0.0)

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Semantic Versioning](https://semver.org/)

## 总结

遵循本规范能够：
- ✅ 提升代码历史可读性
- ✅ 便于团队协作和代码审查
- ✅ 支持自动化工具和版本发布
- ✅ 改善项目维护体验
- ✅ 建立专业的开发流程

如有疑问或建议，请提交Issue讨论。