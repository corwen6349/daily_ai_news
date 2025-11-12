import { useState } from 'react';
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

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'sources' | 'articles' | 'reports'>('sources');
  const [loading, setLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);
  
  const { data: sources = [], mutate: mutateSources } = useSWR<Source[]>('/api/sources', fetcher);
  const { data: articles = [], mutate: mutateArticles } = useSWR<Article[]>('/api/articles', fetcher);
  const { data: reports = [] } = useSWR<Report[]>('/api/reports', fetcher);

  const handleFetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/fetch-news', { method: 'POST' });
      const result = await response.json();
      alert(`✅ 成功抓取 ${result.count} 篇资讯`);
      mutateArticles();
    } catch (error) {
      alert('❌ 抓取失败：' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setLoading(false);
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
                    今日资讯 {selectedArticles.size > 0 && `(已选 ${selectedArticles.size} 篇)`}
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

                <div className="space-y-4">
                  {articles.map(article => (
                    <div 
                      key={article.id}
                      className={`border rounded-lg p-5 transition-all cursor-pointer ${
                        selectedArticles.has(article.id)
                          ? 'bg-blue-50 border-blue-300 shadow-md'
                          : 'bg-white hover:shadow-md'
                      }`}
                      onClick={() => toggleArticleSelection(article.id)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedArticles.has(article.id)}
                          onChange={() => toggleArticleSelection(article.id)}
                          className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {article.title}
                            </a>
                          </h3>
                          {article.summary && (
                            <p className="text-slate-600 text-sm leading-relaxed mb-3">
                              {article.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>📅 {new Date(article.published_at || '').toLocaleDateString('zh-CN')}</span>
                            <span>🔗 来源: {sources.find(s => s.id === article.source_id)?.name || '未知'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {articles.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <p className="text-lg">暂无资讯</p>
                      <p className="text-sm mt-2">点击上方&ldquo;抓取资讯&rdquo;按钮获取最新内容</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 历史日报 Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-6">历史日报</h2>
                <div className="grid gap-4">
                  {reports.map(report => (
                    <div key={report.id} className="border rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            📅 {report.date}
                          </h3>
                          <p className="text-sm text-slate-600">包含 {report.article_ids.length} 篇资讯</p>
                        </div>
                        {report.github_url && (
                          <a
                            href={report.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            📖 查看日报
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <p className="text-lg">暂无历史日报</p>
                      <p className="text-sm mt-2">生成第一份日报吧！</p>
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
