import React from "react";
import { db } from "../../lib/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function followRequests(uid: string) {
  if (!uid) {
    return null;
  }

    const userRef = doc(db, "users", uid);
}
