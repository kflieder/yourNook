import admin from 'firebase-admin';
import { cookies } from 'next/headers';

export interface CurrentUser {
    uid: string;
    displayName: string;
    photoURL?: string;
}

export async function getCurrentUserServer() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const userRecord = await admin.auth().getUser(decodedClaims.uid);
        return {
            uid: userRecord.uid,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL || undefined
        }
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}