# 小型电商商品管理系统 (Small E-commerce Management System)

基于 **Laravel** (后端) 和 **React** (前端) 开发的现代化轻量级电商后台管理系统。本项目采用前后端分离架构，使用 Docker 容器化部署，提供美观、清爽的用户界面和完善的数据管理功能。

## ✨ 项目功能

- **用户认证**：安全登录、退出、个人信息修改（个人中心）。
- **商品管理**：商品的增删改查（CRUD），支持库存、价格、分类关联。
- **分类管理**：商品分类的维护，支持中文描述。
- **订单管理**：订单记录的查看、创建、编辑（支持日期选择）、删除及状态流转。
- **现代化UI**：基于 Ant Design 和 Tailwind CSS 构建，响应式设计，操作流畅。
- **国际化**：全站默认支持简体中文。

## 🛠 技术栈

### 后端 (Backend)
- **Framework**: Laravel 11/12 (API Mode)
- **Language**: PHP 8.4
- **Database**: PostgreSQL 17
- **Architecture**: MVC + Service Layer

### 前端 (Frontend)
- **Framework**: React 18 + Vite
- **UI Library**: Ant Design v5
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

### 基础设施
- **Containerization**: Docker & Docker Compose
- **Web Server**: Built-in PHP Development Server (开发环境) / Nginx (可扩展)

## 📂 目录结构

```
project/
├── backend/                # Laravel 后端代码
│   ├── app/                # 核心业务逻辑 (Models, Controllers, Services)
│   ├── database/           # 数据库迁移与种子数据
│   ├── routes/             # API 路由定义
│   └── ...
├── frontend/               # React 前端代码
│   ├── src/
│   │   ├── components/     # 公共组件 (Layout, Header)
│   │   ├── pages/          # 页面组件 (Auth, Products, Orders)
│   │   ├── contexts/       # 全局状态 (User, Token)
│   │   └── ...
│   └── ...
├── docker-compose.yml      # Docker 服务编排配置
└── README.md               # 项目说明文档
```

## 🚀 快速开始 (Docker 部署)

本项目已完全容器化，推荐使用 Docker Compose 进行一键启动。

### 前置要求
- Docker Desktop
- Git

### 启动步骤

1. **启动服务**
   ```bash
   docker compose up -d --build
   ```
   该命令将自动构建前端和后端镜像，并启动 PostgreSQL 数据库。

2. **访问应用**
   打开浏览器访问：[http://localhost:3000](http://localhost:3000)

## 🔑 默认账号

系统已预置测试管理员账号，登录页面也会有提示：

- **邮箱**: `test@example.com`
- **密码**: `password`

## 📦 开发指南

### 本地开发端口映射
- **Frontend**: http://localhost:3000 (映射自容器 5173)
- **Backend**: 仅容器间通信 (端口 8000，不直接暴露到宿主机)
- **Database**: 仅容器间通信 (端口 5432，不直接暴露到宿主机)

### 常用命令
- **进入后端容器**: `docker compose exec backend /bin/bash`
- **进入前端容器**: `docker compose exec frontend /bin/sh`
- **查看日志**: `docker compose logs -f`

---
Powered by Laravel & React
