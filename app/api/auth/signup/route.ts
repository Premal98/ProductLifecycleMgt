import { NextRequest } from 'next/server';
import { badRequest, ok, serverError } from '@/lib/http';
import { signupWithEmail } from '@/services/authService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, organization_name, industry } = body as {
      email?: string;
      password?: string;
      full_name?: string;
      organization_name?: string;
      industry?: string;
    };

    const organizationName = organization_name?.trim() ?? '';
    const fullName = full_name?.trim() ?? '';

    if (!email || !password || !organizationName || !fullName) {
      return badRequest('email, password, full_name and organization_name are required');
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
  } catch (error) {
    return serverError('Signup failed', (error as Error).message);
  }
}
