import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import app from "../lib/firebaseConfig";

const db = getFirestore(app);

export type DocumentItem = {
    id: string;
    userId: string;
    name: string;
    type: "contract" | "ir" | "report";
    size: string;
    period?: string;
    url?: string;
    createdAt?: any;
};

export async function addDocument(item: Omit<DocumentItem, "id" | "createdAt">) {
    const ref = await addDoc(collection(db, "documents"), { ...item, createdAt: serverTimestamp() });
    return ref.id;
}

export async function listDocuments(userId: string, type?: DocumentItem["type"]) {
    const base = collection(db, "documents");
    const q = type ? query(base, where("userId", "==", userId), where("type", "==", type)) : query(base, where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as DocumentItem[];
}


