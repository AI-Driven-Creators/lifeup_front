#!/bin/bash

# 快速部署脚本（无交互，自动确认）
# 用法: ./quick-deploy.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/root/lfup/lifeup_front"
NGINX_DIR="/var/www/lifeup-front"

cd "$PROJECT_DIR"

echo -e "${BLUE}[1/4]${NC} 清理旧构建..."
rm -rf dist

echo -e "${BLUE}[2/4]${NC} 构建前端..."
npm run build

echo -e "${BLUE}[3/4]${NC} 部署到 Nginx..."
sudo mkdir -p "$NGINX_DIR"
sudo cp -r dist/* "$NGINX_DIR/"
sudo chown -R www-data:www-data "$NGINX_DIR"
sudo chmod -R 755 "$NGINX_DIR"

echo -e "${BLUE}[4/4]${NC} 重启 Nginx..."
sudo systemctl reload nginx

echo ""
echo -e "${GREEN}✓ 部署完成！${NC}"
echo -e "${GREEN}✓ 访问: https://lifeup-study.top${NC}"
