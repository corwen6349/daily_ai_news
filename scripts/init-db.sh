#!/bin/bash

# 初始化脚本 - 数据库表结构

# 使用 Supabase CLI 初始化数据库

# 1. 创建 sources 表
supabase db push << 'SQL'
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sources_enabled ON sources(enabled);
CREATE INDEX idx_sources_category ON sources(category);
SQL

# 2. 创建 articles 表
supabase db push << 'SQL'
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  link TEXT NOT NULL UNIQUE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  pub_date TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT now(),
  content TEXT,
  author TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_articles_pub_date ON articles(pub_date DESC);
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
SQL

# 3. 创建 daily_reports 表
supabase db push << 'SQL'
CREATE TABLE IF NOT EXISTS daily_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  selected_articles UUID[] NOT NULL DEFAULT '{}',
  summary TEXT,
  generated_html TEXT,
  published_at TIMESTAMP,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_daily_reports_date ON daily_reports(date DESC);
CREATE INDEX idx_daily_reports_status ON daily_reports(status);
SQL

# 4. 创建 users 表（可选，用于身份验证）
supabase db push << 'SQL'
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
SQL

echo "✅ 数据库初始化完成！"
echo ""
echo "创建的表："
echo "  - sources: 信息源配置"
echo "  - articles: 采集的文章"
echo "  - daily_reports: 每日日报"
echo "  - users: 用户账户（可选）"
echo ""
echo "现在可以访问 Supabase 控制台查看表结构。"
