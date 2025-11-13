export interface SummaryInput {
  title: string;
  content: string;
  url: string;
  images?: string[];  // 原文中的图片 URL
  videos?: string[];  // 原文中的视频 URL
}
