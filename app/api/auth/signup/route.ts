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

    if (!email || !password || !organization_name) {
      return badRequest('email, password and organization_name are required');
    }

    const { data, error } = await signupWithEmail({
      email,
      password,
      fullName: full_name,
      organizationName: organization_name,
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
