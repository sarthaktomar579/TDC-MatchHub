import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/dataAccess';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const user = authenticate(username, password);
    if (user) {
      // In a real app, use JWT or proper session management
      // For MVP, setting a simple cookie with the matchmaker ID
      const cookieStore = await cookies();
      cookieStore.set('matchmakerId', user.id, { httpOnly: true, path: '/' });
      
      return NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const matchmakerId = cookieStore.get('matchmakerId')?.value;
  
  if (matchmakerId) {
    return NextResponse.json({ authenticated: true, matchmakerId });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('matchmakerId');
  return NextResponse.json({ success: true });
}
