-- ============================================
-- 数据库迁移脚本：添加图片和视频字段支持
-- ============================================
-- 执行时间：2025-11-13
-- 描述：为 articles 表添加 images 和 videos 字段，支持多媒体内容提取

-- 1. 为 articles 表添加图片字段（文本数组）
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 2. 为 articles 表添加视频字段（文本数组）
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT '{}';

-- 3. 添加索引以提升查询性能（可选）
CREATE INDEX IF NOT EXISTS idx_articles_images ON articles USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_articles_videos ON articles USING GIN (videos);

-- 4. 验证字段是否添加成功
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'articles' AND column_name IN ('images', 'videos');
