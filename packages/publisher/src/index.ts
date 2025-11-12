import { getConfig } from '@daily-ai-news/config';

export async function publishReport(htmlContent: string, date: string): Promise<void> {
  const config = getConfig();

  if (!config.githubToken || !config.githubRepo) {
    console.warn('未配置 GitHub，跳过发布步骤');
    return;
  }

  const [owner, repo] = config.githubRepo.split('/');
  const fileName = `reports/${date}.html`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`;

  try {
    // Check if file exists
    let sha: string | undefined;
    const checkResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (checkResponse.ok) {
      const existingFile = await checkResponse.json();
      sha = existingFile.sha;
    }

    // Create or update file
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update report for ${date}`,
        content: Buffer.from(htmlContent).toString('base64'),
        ...(sha && { sha })
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API 请求失败: ${response.status} ${errorText}`);
    }

    console.log(`日报已成功发布到 GitHub: ${fileName}`);
  } catch (error) {
    console.error('发布到 GitHub 失败:', error);
    throw error;
  }
}
