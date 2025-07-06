// lib/firebaseAdmin.ts
import admin from 'firebase-admin';
import serviceAccount from '../lib/firebase-admin-key.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}
console.log('Firebase Admin initialized', serviceAccount.client_email);

export default admin;
