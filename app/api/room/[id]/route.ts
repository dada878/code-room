import { NextResponse } from 'next/server';
import { rooms } from '@/lib/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const exists = params.id in rooms;
  if (exists) {
    return NextResponse.json({ exists: true });
  }
  return NextResponse.json({ exists: false }, { status: 404 });
}
