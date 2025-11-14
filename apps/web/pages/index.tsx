import { useState } from 'react';
import * as React from 'react';
import useSWR from 'swr';
import { Source, Article, Report } from '@daily-ai-news/db';

const fetcher = (url: string) => fetch(url).then(async res => {
  const data = await res.json();
  
  // 确保返回数组，处理错误响应
  if (data && typeof data === 'object') {
    if (data.error) {
      const errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
      console.error(`API error from ${url}:`, errorMsg);
      if (data.stack) console.error('Stack:', data.stack);
      
      // 如果有备用数据字段，使用它
      if (Array.isArray(data.sources)) return data.sources;
      if (Array.isArray(data.articles)) return data.articles;
      if (Array.isArray(data.reports)) return data.reports;
      
      // 抛出错误以便 SWR 可以捕获
      throw new Error(errorMsg);
    }
    if (Array.isArray(data)) return data;
  }
  return [];
});

interface ArticlesResponse {
  articles: Article[];
  groupedByDate: Record<string, Article[]>;
  pagination: {
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

const articlesFetcher = (url: string) => fetch(url).then(res => res.json());

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'sources' | 'articles' | 'reports'>('sources');
  const [loading, setLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState<string>('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => {
    // 默认只展开今天的日期
    const today = new Date().toISOString().split('T')[0];
    return new Set([today]);
  });
  
  const { data: sources = [], mutate: mutateSources } = useSWR<Source[]>('/api/sources', fetcher);
  const { data: articlesData, mutate: mutateArticles } = useSWR<ArticlesResponse>(
    `/api/articles?page=${currentPage}&pageSize=${pageSize}`,
    articlesFetcher
  );
  const { data: reports = [] } = useSWR<Report[]>('/api/reports', fetcher);
  
  const articles = articlesData?.articles || [];
  const groupedByDate = articlesData?.groupedByDate || {};
  const pagination = articlesData?.pagination || { page: 1, pageSize: 50, hasMore: false };

  // 处理历史日报：同一日期只保留最新一条，按日期倒序
  const processedReports = React.useMemo(() => {
    const reportsByDate = new Map<string, Report>();
    
    // 按创建时间排序（最新的在前），同一日期只保留第一条
    const sortedReports = [...reports].sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
    
    sortedReports.forEach(report => {
      if (!reportsByDate.has(report.date)) {
        reportsByDate.set(report.date, report);
      }
    });
    
    // 按日期倒序排列
    return Array.from(reportsByDate.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [reports]);

  const handleFetchNews = async () => {
    setLoading(true);
    setFetchProgress('正在抓取资讯...');
    try {
      const response = await fetch('/api/fetch-news', { method: 'POST' });
      const result = await response.json();
      setFetchProgress(`成功抓取 ${result.count} 篇资讯`);
      await mutateArticles();
      // 延迟一下让用户看到成功消息，然后自动切换到资讯列表
      setTimeout(() => {
        setLoading(false);
        setFetchProgress('');
        setActiveTab('articles');
        setCurrentPage(1);
      }, 800);
    } catch (error) {
      setFetchProgress('');
      setLoading(false);
      alert('❌ 抓取失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleSaveSource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      category: formData.get('category') as string
    };

    try {
      if (editingSource) {
        // 更新源 - 需要实现 PUT 方法
        await fetch(`/api/sources?id=${editingSource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        // 新增源
        await fetch('/api/sources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      setShowSourceModal(false);
      setEditingSource(null);
      mutateSources();
    } catch (error) {
      alert('操作失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleDeleteSource = async (id: string) => {
    if (!confirm('确定要删除这个订阅源吗？')) return;
    
    try {
      await fetch(`/api/sources?id=${id}`, { method: 'DELETE' });
      mutateSources();
    } catch (error) {
      alert('删除失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const toggleArticleSelection = (id: string) => {
    const newSelection = new Set(selectedArticles);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedArticles(newSelection);
  };

  const handleGenerateReport = async () => {
    if (selectedArticles.size === 0) {
      alert('请至少选择一篇资讯');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articleIds: Array.from(selectedArticles),
          date: new Date().toISOString().split('T')[0]
        })
      });
      const result = await response.json();
      alert(`✅ 日报生成成功！\n已发布到：${result.url || 'GitHub Pages'}`);
      setSelectedArticles(new Set());
    } catch (error) {
      alert('❌ 生成失败：' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">正在抓取资讯</h3>
              <p className="text-slate-600 text-center">{fetchProgress || '请稍候...'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Daily AI News
              </h1>
              <p className="text-slate-600 mt-1">每日 AI 资讯聚合平台</p>
            </div>
            <button
              onClick={handleFetchNews}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ 抓取中...' : '🔄 抓取资讯'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'sources'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📡 订阅源管理 ({sources.length})
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📰 资讯列表 ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 历史日报 ({reports.length})
            </button>
          </div>

          <div className="p-6">
            {/* 订阅源管理 Tab */}
            {activeTab === 'sources' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">订阅源列表</h2>
                  <button
                    onClick={() => { setEditingSource(null); setShowSourceModal(true); }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    ➕ 添加订阅源
                  </button>
                </div>

                <div className="grid gap-4">
                  {sources.map(source => (
                    <div key={source.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-slate-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800">{source.name}</h3>
                            {source.category && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {source.category}
                              </span>
                            )}
                          </div>
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {source.url}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingSource(source); setShowSourceModal(true); }}
                            className="px-3 py-1 text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                          >
                            ✏️ 编辑
                          </button>
                          <button
                            onClick={() => handleDeleteSource(source.id)}
                            className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                          >
                            🗑️ 删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 资讯列表 Tab */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">
                    资讯列表 {selectedArticles.size > 0 && `(已选 ${selectedArticles.size} 篇)`}
                  </h2>
                  {selectedArticles.size > 0 && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedArticles(new Set())}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                      >
                        取消选择
                      </button>
                      <button
                        onClick={handleGenerateReport}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? '⏳ 生成中...' : '✨ 生成日报'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 按日期分组显示 */}
                <div className="space-y-8">
                  {Object.entries(groupedByDate)
                    .sort(([dateA], [dateB]) => {
                      // 按日期降序排列（最新的在前）
                      if (dateA === '未知日期') return 1;
                      if (dateB === '未知日期') return -1;
                      return new Date(dateB).getTime() - new Date(dateA).getTime();
                    })
                    .map(([date, dateArticles]) => {
                      const isToday = date === new Date().toISOString().split('T')[0];
                      const isExpanded = isToday || expandedDates.has(date);
                      return (
                    <div key={date} className="space-y-4">
                      {/* 日期标题 - 当日不可折叠，历史可折叠 */}
                      <div 
                        className={`sticky top-0 z-10 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-3 rounded-lg shadow-md flex items-center justify-between transition-all ${
                          isToday ? '' : 'cursor-pointer hover:shadow-lg'
                        }`}
                        onClick={() => {
                          if (isToday) return; // 当日不可折叠
                          const newExpanded = new Set(expandedDates);
                          if (isExpanded) {
                            newExpanded.delete(date);
                          } else {
                            newExpanded.add(date);
                          }
                          setExpandedDates(newExpanded);
                        }}
                      >
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          {!isToday && (
                            <span className="transition-transform" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                          )}
                          <span>📅</span>
                          <span>{date}</span>
                          {isToday && <span className="text-xs bg-yellow-400 text-slate-800 px-2 py-0.5 rounded-full">今天</span>}
                        </h3>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                          {dateArticles.length} 篇
                        </span>
                      </div>
                      
                      {/* 该日期下的文章列表 */}
                      {isExpanded && (
                      <div className="space-y-3 pl-4">
                        {dateArticles.filter(article => article.id).map(article => (
                          <div 
                            key={article.id}
                            className={`border rounded-lg p-4 transition-all cursor-pointer ${
                              selectedArticles.has(article.id!)
                                ? 'bg-blue-50 border-blue-300 shadow-md'
                                : 'bg-white hover:shadow-md hover:border-blue-200'
                            }`}
                            onClick={() => toggleArticleSelection(article.id!)}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={selectedArticles.has(article.id!)}
                                onChange={() => toggleArticleSelection(article.id!)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-semibold text-slate-800 mb-2 leading-snug">
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {article.title}
                                  </a>
                                </h4>
                                {article.summary && (
                                  <p className="text-slate-600 text-sm leading-relaxed mb-2 line-clamp-2">
                                    {article.summary}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                  <span>🔗 {sources.find(s => s.id === article.source_id)?.name || '未知来源'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      )}
                    </div>
                    );
                  })}
                  
                  {articles.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-xl font-semibold mb-2">暂无资讯</p>
                      <p className="text-sm">点击上方&ldquo;抓取资讯&rdquo;按钮获取最新内容</p>
                    </div>
                  )}
                </div>

                {/* 分页控制 */}
                {articles.length > 0 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← 上一页
                    </button>
                    <span className="text-slate-600 font-medium">
                      第 {pagination.page} 页
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!pagination.hasMore}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      下一页 →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 历史日报 Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-6">📚 历史日报</h2>
                <div className="grid gap-4">
                  {processedReports.map(report => {
                    const reportUrl = report.published_url || report.github_url;
                    return (
                    <div 
                      key={report.id} 
                      className="rounded-lg p-6 shadow-md hover:shadow-xl transition-all bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 group outline-none focus:outline-none cursor-pointer"
                      onClick={() => {
                        if (reportUrl) {
                          window.open(reportUrl, '_blank');
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">📰</span>
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                                AI 日报 - {new Date(report.date).toLocaleDateString('zh-CN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">
                                创建于 {new Date(report.created_at || '').toLocaleString('zh-CN')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              包含 {report.article_ids?.length || 0} 篇资讯
                            </span>
                            
                            {reportUrl && (
                              <span className="flex items-center gap-1 text-green-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                点击查看完整日报
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                  {processedReports.length === 0 && (
                    <div className="text-center py-16 text-slate-500">
                      <div className="text-6xl mb-4">📭</div>
                      <p className="text-xl font-semibold mb-2">暂无历史日报</p>
                      <p className="text-sm">切换到&ldquo;资讯列表&rdquo;选择文章生成第一份日报吧！</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 订阅源编辑弹窗 */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSourceModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-slate-800">
                {editingSource ? '✏️ 编辑订阅源' : '➕ 添加订阅源'}
              </h3>
            </div>
            <form onSubmit={handleSaveSource} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">名称</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingSource?.name}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：OpenAI Blog"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">RSS URL</label>
                <input
                  type="url"
                  name="url"
                  defaultValue={editingSource?.url}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/feed.xml"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">分类</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingSource?.category}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：AI Research"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowSourceModal(false); setEditingSource(null); }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
