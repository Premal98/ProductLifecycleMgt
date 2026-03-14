import { NextRequest, NextResponse } from 'next/server';
import { badRequest, serverError, unauthorized } from '@/lib/http';
import { applySessionCookies, loginWithEmail } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return badRequest('email and password are required');
    }

    const { data, error } = await loginWithEmail({ email, password });
    if (error || !data.session || !data.user) {
      return unauthorized(error?.message || 'Invalid credentials');
    }

    const response = NextResponse.json({ data: { user: data.user } }, { status: 200 });
    applySessionCookies(response, data.session, data.user);
    return response;
  } catch (error) {
    return serverError('Authentication failed', (error as Error).message);
  }
}
