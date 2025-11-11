/**
 * 获取信息源列表
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSources, addSource, updateSource } from '@daily-ai-news/db';

export async function GET(request: NextRequest) {
  try {
    const sources = await getSources();
    return NextResponse.json(sources);
  } catch (error) {
    console.error('Failed to get sources:', error);
    return NextResponse.json(
      { error: 'Failed to get sources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const source = await addSource({
      url: body.url,
      name: body.name,
      category: body.category || 'general',
      enabled: true,
    });
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error('Failed to add source:', error);
    return NextResponse.json(
      { error: 'Failed to add source' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const source = await updateSource(body.id, body);
    return NextResponse.json(source);
  } catch (error) {
    console.error('Failed to update source:', error);
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    );
  }
}
