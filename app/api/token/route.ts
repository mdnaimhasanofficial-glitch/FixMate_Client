import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

// updateUser দিয়ে যেকোনো ইউজার নিজের user collection-এ
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ message: 'Unauthorized' }, { status: 401 });
  const token = jwt.sign({ email: session.user.email }, process.env.JWT_SECRET as string, {
    expiresIn: '1d',
  });
  return Response.json({ token });
}
