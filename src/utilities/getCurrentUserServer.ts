import admin from 'firebase-admin';
import { cookies } from 'next/headers';


export async function getCurrentUserServer() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        const userRecord = await admin.auth().getUser(decodedClaims.uid);
        return userRecord.uid;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}