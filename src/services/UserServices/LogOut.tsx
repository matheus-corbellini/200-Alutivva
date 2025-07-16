import { getAuth, signOut } from "firebase/auth";
import app from "../../lib/firebaseConfig";

const auth = getAuth(app);

export async function logOutUser() {
  await signOut(auth);
}
