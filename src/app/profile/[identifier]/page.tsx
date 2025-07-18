// app/profile/[identifier]/page.tsx
import admin from "../../../../lib/firebaseAdmin";
import ProfilePage from "../../../../components/profile/ProfilePage";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // Ensure this page is always dynamic

interface Props {
  params: {
    identifier: string;
  };
}

type ProfilePageProps = {
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
    uid?: string;
  };
  posts: Array<{
    id: string;
    [key: string]: any;
  }>;
};

export default async function UserProfile({ params }: Props) {
  const { identifier } = await params;
  const db = admin.firestore();
  const usersRef = db.collection("users");
  const urlQuery = await usersRef
    .where("uniqueUrl", "==", identifier)
    .limit(1)
    .get();
  let userData;

  console.log("Fetching user profile for identifier:", identifier);

  if (!urlQuery.empty) {
    const doc = urlQuery.docs[0];
    userData = { uid: doc.id, ...doc.data() } as ProfilePageProps["userData"];
  } else {
    // Step 2: Try matching document ID (i.e., UID)
    const userDoc = await usersRef.doc(identifier).get();

    if (userDoc.exists) {
      userData = {
        uid: userDoc.id,
        ...userDoc.data(),
      } as ProfilePageProps["userData"];
    } else {
      return notFound(); // 404 page
    }
  }
 

  // Step 3: Fetch posts by the user
  const postsSnapshot = await db
    .collection("posts")
    .where("uid", "==", userData.uid)
    .orderBy("createdAt", "desc")
    .get();

  const posts = postsSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };
  });

  if (!userData) {
  return notFound();
}

  return (
    <div className="p-4">
      <ProfilePage
        userData={userData as ProfilePageProps["userData"]}
        posts={posts}
      />
    </div>
  );
}
