#!/bin/bash

# 前端自动编译部署脚本
# 用法: ./deploy.sh [dev|prod]

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/root/lfup/lifeup_front"
NGINX_DIR="/var/www/lifeup-front"

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# 检查是否在正确的目录
if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_error "找不到 package.json，请确认在正确的目录"
    exit 1
fi

cd "$PROJECT_DIR"

# 获取部署模式（默认为 production）
MODE=${1:-prod}

print_info "======================================"
print_info "  前端自动编译部署脚本"
print_info "  模式: $MODE"
print_info "======================================"
echo ""

# 步骤 1: 清理旧的构建产物
print_info "步骤 1/5: 清理旧的构建产物..."
if [ -d "dist" ]; then
    rm -rf dist
    print_success "已清理旧的构建产物"
else
    print_info "没有旧的构建产物需要清理"
fi
echo ""

# 步骤 2: 安装依赖（可选）
read -p "是否需要重新安装依赖？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "步骤 2/5: 安装依赖..."
    npm install
    print_success "依赖安装完成"
else
    print_info "步骤 2/5: 跳过依赖安装"
fi
echo ""

# 步骤 3: 构建项目
print_info "步骤 3/5: 构建前端项目..."
if [ "$MODE" = "dev" ]; then
    print_warning "开发模式不应部署到生产环境！"
    read -p "确定要继续吗？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "部署已取消"
        exit 1
    fi
fi

npm run build

if [ ! -d "dist" ]; then
    print_error "构建失败：找不到 dist 目录"
    exit 1
fi

print_success "前端构建完成"
echo ""

# 步骤 4: 备份现有部署（可选）
print_info "步骤 4/5: 备份现有部署..."
if [ -d "$NGINX_DIR" ]; then
    BACKUP_DIR="/root/lfup/backups/lifeup-front-$(date +%Y%m%d-%H%M%S)"
    sudo mkdir -p "$(dirname "$BACKUP_DIR")"
    sudo cp -r "$NGINX_DIR" "$BACKUP_DIR"
    print_success "已备份到: $BACKUP_DIR"
else
    print_info "首次部署，无需备份"
fi
echo ""

# 步骤 5: 部署到 Nginx
print_info "步骤 5/5: 部署到 Nginx..."

# 确保目标目录存在
sudo mkdir -p "$NGINX_DIR"

# 复制文件
sudo cp -r dist/* "$NGINX_DIR/"

# 设置权限
sudo chown -R www-data:www-data "$NGINX_DIR"
sudo chmod -R 755 "$NGINX_DIR"

print_success "文件复制完成"
echo ""

# 重启 Nginx
print_info "重启 Nginx..."
sudo systemctl reload nginx

# 检查 Nginx 状态
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx 重启成功"
else
    print_error "Nginx 重启失败！请检查配置"
    sudo systemctl status nginx
    exit 1
fi

echo ""
print_success "======================================"
print_success "  部署完成！"
print_success "======================================"
echo ""
print_info "访问地址: https://lifeup-study.top"
print_info "构建产物: $NGINX_DIR"
print_info "备份位置: $BACKUP_DIR (如果有)"
echo ""

# 显示部署信息
print_info "文件统计:"
du -sh "$NGINX_DIR"
echo ""

# 测试访问
print_info "测试访问..."
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost:443 | grep -q "200"; then
    print_success "网站可以正常访问 ✓"
else
    print_warning "网站访问测试失败，请手动检查"
fi

echo ""
print_info "部署日志已记录"
