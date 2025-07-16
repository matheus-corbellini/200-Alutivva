import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../lib/firebaseConfig";

const auth = getAuth(app);

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}
