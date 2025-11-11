/**
 * 前端应用 - 配置和管理界面
 * 基于 Next.js 部署在 Vercel
 */

import React, { useState, useEffect } from 'react';

interface Source {
  id: string;
  url: string;
  name: string;
  category: string;
  enabled: boolean;
}

interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  sourceName: string;
  pubDate: string;
}

interface DailyReport {
  id: string;
  date: string;
  selectedArticles: string[];
  summary?: string;
  generatedHtml?: string;
  publishedAt?: string;
  status: 'draft' | 'published' | 'archived';
}

export default function Home() {
  const [sources, setSources] = useState<Source[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [tab, setTab] = useState<'sources' | 'articles' | 'reports'>('sources');
  const [loading, setLoading] = useState(false);
  const [selectedReportDate, setSelectedReportDate] = useState<string>('');

  useEffect(() => {
    fetchSources();
    fetchArticles();
    fetchReports();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      setDailyReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

  const handleFetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fetch-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.success) {
        alert(`成功获取 ${data.count} 篇新文章！`);
        await fetchArticles();
      } else {
        alert(data.error || '获取失败');
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      alert('获取资讯出错');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.get('url'),
          name: formData.get('name'),
          category: formData.get('category'),
        }),
      });

      if (res.ok) {
        fetchSources();
        (e.currentTarget as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Failed to add source:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishReport = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString(),
          selectedArticles,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('日报已生成并发布！');
        setSelectedArticles([]);
        await fetchReports();
      } else {
        alert(data.error || '发布失败');
      }
    } catch (error) {
      console.error('Failed to publish report:', error);
      alert('发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 按日期分组文章
  const articlesByDate = articles.reduce((acc, article) => {
    const date = new Date(article.pubDate).toLocaleDateString('zh-CN');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(article);
    return acc;
  }, {} as Record<string, Article[]>);

  const sortedDates = Object.keys(articlesByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>🤖 AI 新闻聚合平台</h1>

      {/* Tab 导航 */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', display: 'flex', flexWrap: 'wrap' }}>
        {(['sources', 'articles', 'reports'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '10px 20px',
              background: tab === t ? '#667eea' : 'transparent',
              color: tab === t ? 'white' : '#333',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
              fontWeight: tab === t ? 'bold' : 'normal',
            }}
          >
            {t === 'sources'
              ? '📰 信息源'
              : t === 'articles'
                ? '📄 文章'
                : '📊 查看日报'}
          </button>
        ))}
      </div>

      {/* 信息源管理 */}
      {tab === 'sources' && (
        <div>
          <h2>管理信息源</h2>
          <form onSubmit={handleAddSource} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="name"
              placeholder="信息源名称"
              required
              style={{ marginRight: '10px', padding: '8px' }}
            />
            <input
              type="url"
              name="url"
              placeholder="RSS 链接"
              required
              style={{ marginRight: '10px', padding: '8px' }}
            />
            <input
              type="text"
              name="category"
              placeholder="分类"
              style={{ marginRight: '10px', padding: '8px' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
              {loading ? '添加中...' : '添加'}
            </button>
          </form>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>名称</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>链接</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>分类</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>状态</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{source.name}</td>
                  <td style={{ padding: '10px', fontSize: '12px' }}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      {source.url.substring(0, 40)}...
                    </a>
                  </td>
                  <td style={{ padding: '10px' }}>{source.category}</td>
                  <td style={{ padding: '10px' }}>
                    {source.enabled ? '✅ 启用' : '❌ 禁用'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 文章列表 */}
      {tab === 'articles' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ display: 'inline', marginRight: '20px' }}>选择文章（最多10篇）</h2>
              <span style={{ fontSize: '16px', color: '#666' }}>已选择: {selectedArticles.length}/10</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleFetchNews}
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  background: loading ? '#ccc' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                }}
              >
                {loading ? '加载中...' : '🔄 手动获取资讯'}
              </button>
              <button
                onClick={handlePublishReport}
                disabled={selectedArticles.length === 0 || loading}
                style={{
                  padding: '10px 20px',
                  background: selectedArticles.length === 0 ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: selectedArticles.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {loading ? '生成中...' : '✨ 生成今日日报'}
              </button>
            </div>
          </div>

          <div>
            {sortedDates.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                还没有文章，请先手动获取资讯
              </p>
            ) : (
              sortedDates.map((date) => (
                <div key={date} style={{ marginBottom: '20px' }}>
                  <h3 style={{ 
                    fontSize: '16px', 
                    color: '#667eea', 
                    borderBottom: '2px solid #667eea',
                    paddingBottom: '8px',
                    marginBottom: '12px'
                  }}>
                    📅 {date} ({articlesByDate[date].length} 篇)
                  </h3>
                  {articlesByDate[date].map((article) => (
                    <div
                      key={article.id}
                      style={{
                        padding: '15px',
                        marginBottom: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        background: selectedArticles.includes(article.id)
                          ? '#f0f7ff'
                          : '#fff',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <label style={{ cursor: 'pointer', display: 'block' }}>
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              if (selectedArticles.length < 10) {
                                setSelectedArticles([...selectedArticles, article.id]);
                              } else {
                                alert('最多只能选择10篇文章');
                              }
                            } else {
                              setSelectedArticles(
                                selectedArticles.filter((id) => id !== article.id)
                              );
                            }
                          }}
                          style={{ marginRight: '10px', cursor: 'pointer' }}
                        />
                        <strong style={{ fontSize: '15px' }}>{article.title}</strong>
                      </label>
                      <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
                        {article.description.substring(0, 150)}...
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ color: '#999' }}>
                          来源: <strong>{article.sourceName}</strong>
                        </small>
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '12px',
                            color: '#667eea',
                            textDecoration: 'none',
                            padding: '4px 8px',
                            border: '1px solid #667eea',
                            borderRadius: '4px',
                          }}
                        >
                          阅读原文
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 查看日报 */}
      {tab === 'reports' && (
        <div>
          <h2>📊 已生成的日报</h2>
          {dailyReports.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              还没有生成过日报
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {dailyReports
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((report) => (
                  <div
                    key={report.id}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      background: report.status === 'published' ? '#f0f7ff' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ margin: '0', color: '#333' }}>
                        📅 {new Date(report.date).toLocaleDateString('zh-CN')}
                      </h3>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          background: report.status === 'published' ? '#10b981' : '#f59e0b',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {report.status === 'published' ? '✅ 已发布' : '📝 草稿'}
                      </span>
                    </div>
                    <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
                      包含 <strong>{report.selectedArticles.length}</strong> 篇文章
                    </p>
                    {report.publishedAt && (
                      <p style={{ margin: '10px 0', color: '#999', fontSize: '12px' }}>
                        发布时间: {new Date(report.publishedAt).toLocaleString('zh-CN')}
                      </p>
                    )}
                    <button
                      onClick={() => {
                        window.open(`/reports/${new Date(report.date).toISOString().split('T')[0]}.html`, '_blank');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        marginTop: '10px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      📖 查看日报
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
