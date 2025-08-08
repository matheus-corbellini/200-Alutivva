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

  // Permitir criação de admin para desenvolvimento
  const userToSave: User = {
    ...user,
    id: uid,
    status: "pending", // Status padrão para novos usuários
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "users", uid), userToSave);

  return uid;
}

// Função para criar admin (apenas para desenvolvimento)
export async function createAdminUser(
  user: Omit<User, "id" | "createdAt"> & { password: string }
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    const { uid } = userCredential.user;

    const adminUser: User = {
      ...user,
      id: uid,
      role: "admin" as const,
      status: "active", // Admin sempre ativo
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", uid), adminUser);
    return uid;
  } catch (error) {
    console.error("Erro ao criar usuário admin:", error);
    throw error;
  }
}
