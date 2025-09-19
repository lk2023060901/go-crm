#!/bin/bash

# ERP 系统端口检查脚本

# 定义端口范围和服务名称
declare -A ERP_PORTS=(
    [50000]="前端应用"
    [50001]="PostgreSQL"
    [50002]="Redis"
    [50003]="API网关"
    [50004]="认证服务HTTP"
    [50005]="用户服务HTTP"
    [50006]="CRM服务HTTP"
    [50007]="认证服务gRPC"
    [50008]="用户服务gRPC"
    [50009]="CRM服务gRPC"
    [50010]="Grafana"
    [50011]="Prometheus"
    [50012]="Jaeger"
    [50013]="RabbitMQ"
    [50014]="RabbitMQ管理"
    [50015]="MinIO API"
    [50016]="MinIO控制台"
)

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 ERP 系统端口检查工具${NC}"
echo "================================================"

# 检查单个端口
check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
        local process=$(ps -p $pid -o comm= 2>/dev/null || echo "未知进程")
        echo -e "${RED}❌ 端口 $port ($service) 被占用${NC}"
        echo -e "   进程: $process (PID: $pid)"
        return 1
    else
        echo -e "${GREEN}✅ 端口 $port ($service) 可用${NC}"
        return 0
    fi
}

# 检查所有 ERP 端口
check_all_ports() {
    local conflicts=0

    echo -e "${YELLOW}检查 ERP 系统端口 (50000-50016)...${NC}"
    echo ""

    for port in "${!ERP_PORTS[@]}"; do
        if ! check_port $port "${ERP_PORTS[$port]}"; then
            ((conflicts++))
        fi
    done

    echo ""
    echo "================================================"

    if [ $conflicts -eq 0 ]; then
        echo -e "${GREEN}🎉 所有端口检查通过！可以启动 ERP 系统${NC}"
        return 0
    else
        echo -e "${RED}⚠️  发现 $conflicts 个端口冲突${NC}"
        echo ""
        echo "解决方案:"
        echo "1. 停止占用端口的进程: kill <PID>"
        echo "2. 修改 ERP 系统端口配置"
        echo "3. 使用 Docker 容器网络隔离"
        return 1
    fi
}

# 检查指定端口范围
check_port_range() {
    local start_port=$1
    local end_port=$2
    local conflicts=0

    echo -e "${YELLOW}检查端口范围 $start_port-$end_port...${NC}"
    echo ""

    for ((port=$start_port; port<=$end_port; port++)); do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            local pid=$(lsof -Pi :$port -sTCP:LISTEN -t)
            local process=$(ps -p $pid -o comm= 2>/dev/null || echo "未知进程")
            echo -e "${RED}❌ 端口 $port 被占用${NC} - $process (PID: $pid)"
            ((conflicts++))
        fi
    done

    if [ $conflicts -eq 0 ]; then
        echo -e "${GREEN}✅ 端口范围 $start_port-$end_port 全部可用${NC}"
    else
        echo -e "${RED}⚠️  发现 $conflicts 个端口被占用${NC}"
    fi

    return $conflicts
}

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help          显示此帮助信息"
    echo "  -a, --all           检查所有 ERP 端口 (默认)"
    echo "  -r, --range <start-end>  检查指定端口范围"
    echo "  -p, --port <port>   检查单个端口"
    echo ""
    echo "示例:"
    echo "  $0                  # 检查所有 ERP 端口"
    echo "  $0 -r 50000-50020   # 检查端口范围"
    echo "  $0 -p 50000         # 检查单个端口"
}

# 主程序
main() {
    case "${1:-}" in
        -h|--help)
            show_help
            exit 0
            ;;
        -a|--all|"")
            check_all_ports
            exit $?
            ;;
        -r|--range)
            if [[ $2 =~ ^([0-9]+)-([0-9]+)$ ]]; then
                check_port_range ${BASH_REMATCH[1]} ${BASH_REMATCH[2]}
                exit $?
            else
                echo -e "${RED}错误: 无效的端口范围格式，应为 start-end${NC}"
                exit 1
            fi
            ;;
        -p|--port)
            if [[ $2 =~ ^[0-9]+$ ]]; then
                check_port $2 "指定端口"
                exit $?
            else
                echo -e "${RED}错误: 无效的端口号${NC}"
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}错误: 未知选项 $1${NC}"
            show_help
            exit 1
            ;;
    esac
}

# 运行主程序
main "$@"