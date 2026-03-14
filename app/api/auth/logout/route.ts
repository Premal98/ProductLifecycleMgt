import { NextResponse } from 'next/server';
import { clearSessionCookies } from '@/services/authService';

export async function POST() {
  const response = NextResponse.json({ data: { success: true } }, { status: 200 });
  clearSessionCookies(response);
  return response;
}
