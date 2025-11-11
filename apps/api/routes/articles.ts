/**
 * 获取文章列表
 */

import { NextRequest, NextResponse } from 'next/server';
import { getArticles } from '@daily-ai-news/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const articles = await getArticles(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to get articles:', error);
    return NextResponse.json(
      { error: 'Failed to get articles' },
      { status: 500 }
    );
  }
}
