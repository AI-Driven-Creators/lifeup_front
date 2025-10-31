#!/bin/bash

# 回滚脚本 - 恢复到之前的备份
# 用法: ./rollback.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKUP_BASE="/root/lfup/backups"
NGINX_DIR="/var/www/lifeup-front"

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

# 检查备份目录
if [ ! -d "$BACKUP_BASE" ]; then
    print_error "找不到备份目录: $BACKUP_BASE"
    exit 1
fi

# 列出所有备份
print_info "可用的备份:"
echo ""
backups=($(ls -dt "$BACKUP_BASE"/lifeup-front-* 2>/dev/null))

if [ ${#backups[@]} -eq 0 ]; then
    print_error "没有找到任何备份"
    exit 1
fi

# 显示备份列表
for i in "${!backups[@]}"; do
    backup_name=$(basename "${backups[$i]}")
    backup_size=$(du -sh "${backups[$i]}" | cut -f1)
    echo "  [$i] $backup_name ($backup_size)"
done

echo ""
read -p "请选择要恢复的备份编号 (默认 0 - 最新): " choice
choice=${choice:-0}

# 验证选择
if [ "$choice" -lt 0 ] || [ "$choice" -ge "${#backups[@]}" ]; then
    print_error "无效的选择"
    exit 1
fi

selected_backup="${backups[$choice]}"
print_info "选择的备份: $(basename "$selected_backup")"

# 确认回滚
print_warning "这将覆盖当前部署的前端文件"
read -p "确定要继续吗？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "回滚已取消"
    exit 1
fi

# 执行回滚
print_info "正在回滚..."

# 备份当前版本（以防万一）
if [ -d "$NGINX_DIR" ]; then
    current_backup="$BACKUP_BASE/lifeup-front-before-rollback-$(date +%Y%m%d-%H%M%S)"
    sudo mkdir -p "$BACKUP_BASE"
    sudo cp -r "$NGINX_DIR" "$current_backup"
    print_info "当前版本已备份到: $current_backup"
fi

# 恢复备份
sudo rm -rf "$NGINX_DIR"
sudo cp -r "$selected_backup" "$NGINX_DIR"
sudo chown -R www-data:www-data "$NGINX_DIR"
sudo chmod -R 755 "$NGINX_DIR"

# 重启 Nginx
print_info "重启 Nginx..."
sudo systemctl reload nginx

if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx 重启成功"
else
    print_error "Nginx 重启失败！"
    sudo systemctl status nginx
    exit 1
fi

echo ""
print_success "======================================"
print_success "  回滚完成！"
print_success "======================================"
echo ""
print_info "已恢复到: $(basename "$selected_backup")"
print_info "访问地址: https://lifeup-study.top"
echo ""

# 测试访问
print_info "测试访问..."
if curl -k -s -o /dev/null -w "%{http_code}" https://localhost:443 | grep -q "200"; then
    print_success "网站可以正常访问 ✓"
else
    print_warning "网站访问测试失败，请手动检查"
fi
