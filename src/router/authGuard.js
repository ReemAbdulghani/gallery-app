import { auth } from "@/firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

export async function requireAuth() {
  return !!auth.currentUser; // returns true or false
}

export async function requireOwner(albumId) {
  const user = auth.currentUser;

  if (!user) return false;

  const albumRef = doc(db, "albums", albumId);
  const albumSnap = await getDoc(albumRef);

  if (!albumSnap.exists()) return false;

  const album = albumSnap.data();

  return album.ownerId === user.uid;
}
