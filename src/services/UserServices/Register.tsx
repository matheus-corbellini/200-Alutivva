import type { User } from "../../types/users";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import app from "../../lib/firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

export async function registerUser(
  user: Omit<User, "id" | "createdAt"> & { password: string }
) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    user.email,
    user.password
  );
  const { uid } = userCredential.user;

  const userToSave: User = {
    ...user,
    id: uid,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", uid), userToSave);

  return uid;
}
