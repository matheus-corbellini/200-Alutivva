import React, { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import app from "../lib/firebaseConfig";
import { getUserData } from "../services/UserServices/GetUserData";
import type { User } from "../types/users";

type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userData = await getUserData(fbUser.uid);
        setUser(userData as User);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function logout() {
    const { logOutUser } = await import("../services/UserServices/LogOut");
    await logOutUser();
  }

  return (
    <AuthContext.Provider value={{ firebaseUser, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;
