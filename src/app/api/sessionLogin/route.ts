import { NextRequest, NextResponse } from 'next/server';
import admin from '../../../../lib/firebaseAdmin'; // your initialized admin SDK

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Set session expiration (e.g., 5 days)
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

    // Create session cookie from ID token
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie options: HttpOnly, Secure (set to true in prod), sameSite strict
    const response = NextResponse.json({ status: 'success' });
    response.cookies.set('__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000, // seconds
      path: '/',
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 500 });
  }
}
