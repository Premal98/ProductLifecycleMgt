import { NextRequest, NextResponse } from 'next/server';
import { badRequest, ok, serverError, unauthorized } from '@/lib/http';
import { applySessionCookies, loginWithEmail, signupWithEmail } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, password, full_name, organization_name, industry } = body as {
      action?: 'login' | 'signup';
      email?: string;
      password?: string;
      full_name?: string;
      organization_name?: string;
      industry?: string;
    };

    if (!action || !email || !password) {
      return badRequest('action, email and password are required');
    }

    if (action === 'signup') {
      const organizationName = organization_name?.trim() ?? '';
      const fullName = full_name?.trim() ?? '';

      if (!organizationName || !fullName) {
        return badRequest('full_name and organization_name are required for signup');
      }

      const { data, error } = await signupWithEmail({
        email,
        password,
        fullName,
        organizationName,
        industry
      });

      if (error) {
        return badRequest(error.message);
      }

      return ok({ user: data?.user, organization: data?.organization });
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
