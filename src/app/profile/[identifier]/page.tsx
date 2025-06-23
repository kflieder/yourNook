// app/profile/[identifier]/page.tsx
import admin from '../../../../lib/firebaseAdmin';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    identifier: string;
  };
}

export default async function UserProfile({ params }: Props) {
  const { identifier } = params;

  const db = admin.firestore();
  const usersRef = db.collection('users');

  // Step 1: Try finding user by uniqueUrl
  const urlQuery = await usersRef.where('uniqueUrl', '==', identifier).limit(1).get();

  let userData;
  console.log('URL Query:', urlQuery);
  console.log(userData)

  if (!urlQuery.empty) {
    userData = urlQuery.docs[0].data();
  } else {
    // Step 2: Try finding user by UID
    const uidQuery = await usersRef.where('uid', '==', identifier).limit(1).get();

    if (!uidQuery.empty) {
      userData = uidQuery.docs[0].data();
    } else {
      return notFound(); // 404 page if not found
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{userData.displayName || 'Unnamed User'}</h1>
      <p>UID: {userData.uid}</p>
      <p>URL: {userData.uniqueUrl}</p>
    </div>
  );
}
