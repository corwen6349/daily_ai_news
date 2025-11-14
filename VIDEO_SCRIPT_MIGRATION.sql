-- 添加视频口播稿字段到 reports 表
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 添加 video_script 字段
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS video_script TEXT;

-- 2. 添加字段注释
COMMENT ON COLUMN reports.video_script IS '视频口播稿内容，约1分钟（200-250字）';

-- 3. 验证字段是否添加成功
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'reports' AND column_name = 'video_script';
