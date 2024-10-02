import type { NextRequest } from 'next/server';
import { deleteOutdatedPosts } from '@/scripts/delete-outdated-posts';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const { error, success } = await deleteOutdatedPosts();

  if (error) {
    return Response.json({ success: false, error });
  }

  return Response.json({ success });
}
