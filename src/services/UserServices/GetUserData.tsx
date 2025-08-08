import { getFirestore, getDoc, doc } from "firebase/firestore";
import app from "../../lib/firebaseConfig";

const db = getFirestore(app);

export async function getUserData(uid: string) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}
