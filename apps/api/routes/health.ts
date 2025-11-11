/**
 * Vercel API Routes - 后端 API
 */

import { NextRequest, NextResponse } from 'next/server';

// GET /api/health - 健康检查
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
