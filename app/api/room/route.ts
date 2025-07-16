import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { rooms } from '@/lib/store';

export async function POST() {
  const id = uuidv4();
  rooms[id] = '';
  return NextResponse.json({ id });
}
