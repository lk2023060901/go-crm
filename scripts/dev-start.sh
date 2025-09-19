#!/bin/bash

# ERP 系统开发环境启动脚本

echo "🚀 启动 ERP 开发环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查端口占用
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  端口 $port 被占用 ($service)，请先释放端口"
        return 1
    fi
    return 0
}

echo "📋 检查端口占用..."
check_port 50000 "前端开发服务器" || exit 1
check_port 50001 "PostgreSQL" || exit 1
check_port 50002 "Redis" || exit 1
check_port 50004 "认证服务" || exit 1
check_port 50010 "Grafana" || exit 1

# 启动基础设施服务
echo "🐳 启动基础设施服务 (PostgreSQL, Redis, etc.)..."
docker-compose -f docker-compose.dev.yml up -d postgres redis rabbitmq jaeger

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 运行数据库迁移
echo "🗄️  运行数据库迁移..."
# TODO: 添加数据库迁移脚本

# 启动前端开发服务器
echo "🎨 启动前端开发服务器..."
cd apps/web
npm install
npm run dev &
FRONTEND_PID=$!
cd ../..

# 启动后端服务
echo "⚙️  启动后端服务..."
# TODO: 启动 Go 服务

echo "✅ ERP 开发环境启动完成！"
echo ""
echo "📱 前端访问地址: http://localhost:50000"
echo "🔐 登录信息:"
echo "   租户代码: demo"
echo "   用户名: admin"
echo "   密码: admin123"
echo ""
echo "🛠️  开发工具:"
echo "   API 网关: http://localhost:50003"
echo "   Grafana: http://localhost:50010 (admin/admin)"
echo "   RabbitMQ: http://localhost:50014 (erp_user/erp_password)"
echo "   Jaeger: http://localhost:50012"
echo "   MinIO: http://localhost:50016 (minioadmin/minioadmin)"
echo ""
echo "按 Ctrl+C 停止开发环境"

# 等待用户中断
trap 'echo "🛑 正在停止开发环境..."; kill $FRONTEND_PID 2>/dev/null; docker-compose -f docker-compose.dev.yml down; exit 0' INT

wait $FRONTEND_PID