import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import app from "../lib/firebaseConfig";
import { getUserData } from "../services/UserServices/GetUserData";
import type { User } from "../types/users";

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  initialLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("🔐 AuthStateChanged:", fbUser?.uid || "null");
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        try {
          console.log("📋 Buscando dados do usuário:", fbUser.uid);
          const userData = await getUserData(fbUser.uid);
          console.log("✅ Dados do usuário carregados:", userData);
          setUser(userData as User);
        } catch (error) {
          console.error("❌ AuthContext - Error getting user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
      setInitialLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function logout() {
    const { logOutUser } = await import("../services/UserServices/LogOut");
    await logOutUser();
  }

  return (
    <AuthContext.Provider
      value={{ firebaseUser, user, loading, initialLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
