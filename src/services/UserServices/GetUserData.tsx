import { getFirestore, getDoc, doc } from "firebase/firestore";
import app from "../../lib/firebaseConfig";

const db = getFirestore(app);

export async function getUserData(uid: string) {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() ? userDoc.data() : null;
}
