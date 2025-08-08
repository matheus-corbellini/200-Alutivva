import { collection, getDocs, query, orderBy, doc, updateDoc, getFirestore } from "firebase/firestore";
import app from "../../lib/firebaseConfig";
import type { User } from "../../types/users";

const db = getFirestore(app);

export interface AdminUser extends User {
  status: "active" | "pending" | "blocked";
  lastLogin?: string;
  registrationDate: string;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const users: AdminUser[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const user: AdminUser = {
        id: doc.id,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        role: userData.role || "investor",
        createdAt: userData.createdAt,
        status: userData.status || "pending",
        lastLogin: userData.lastLogin || null,
        registrationDate: userData.createdAt ?
          new Date(userData.createdAt.toDate()).toLocaleDateString("pt-BR") :
          new Date().toLocaleDateString("pt-BR")
      };
      users.push(user);
    });

    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
}

export async function updateUserStatus(userId: string, status: "active" | "pending" | "blocked"): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Erro ao atualizar status do usuário:", error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role: role,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Erro ao atualizar role do usuário:", error);
    throw error;
  }
}
