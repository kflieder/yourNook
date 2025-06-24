// app/profile/[identifier]/page.tsx
import admin from '../../../../lib/firebaseAdmin';
import { notFound } from 'next/navigation';
import Bio from '../../../../components/profile/Bio';


export const dynamic = 'force-dynamic'; // Ensure this page is always dynamic

interface Props {
  params: {
    identifier: string;
  };
}

type BioProps = {
  userData: {
    displayName: string;
    pronouns?: {
      she?: boolean;
      he?: boolean;
      theyThem?: boolean;
      other?: string;
    };
    bio?: string;
    links?: string;
    uniqueUrl?: string;
    profilePicture?: string;
  };
};




export default async function UserProfile({ params }: Props) {
  const { identifier } = await params;
  const db = admin.firestore();
  const usersRef = db.collection('users');

  console.log('Identifier param:', identifier);

  // Step 1: Try finding user by uniqueUrl field first
  const urlQuery = await usersRef.where('uniqueUrl', '==', identifier).limit(1).get();

  let userData;
  

  if (!urlQuery.empty) {
    userData = urlQuery.docs[0].data();
    console.log('Matched by uniqueUrl');
  } else {
    // Step 2: Try matching document ID (i.e., UID)
    const userDoc = await usersRef.doc(identifier).get();

    if (userDoc.exists) {
      userData = userDoc.data();
      console.log('Matched by doc ID (UID)');
    } else {
      return notFound(); // 404 page
    }
  }
  if (!userData) {
    return notFound(); // 404 page
  }
  console.log('User data:', userData);

  return (
    <div className="p-4">
      <Bio userData={userData as BioProps['userData']} />
    </div>
  );
}
