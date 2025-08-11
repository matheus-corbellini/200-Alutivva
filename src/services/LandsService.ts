import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import app from "../lib/firebaseConfig";

export interface Land {
    id: number;
    title: string;
    location: string;
    area: string;
    price: number;
    status: "disponível" | "reservado" | "vendido";
    image: string;
    description: string;
    coordinates: { lat: number; lng: number };
    features: string[];
    createdAt?: string;
}

const db = getFirestore(app);
const landsCollection = collection(db, "lands");

export async function listLands(): Promise<Land[]> {
    const snap = await getDocs(query(landsCollection, orderBy("createdAt", "desc")));
    return snap.docs.map(d => ({ ...(d.data() as Land) }));
}

export async function createLand(data: Omit<Land, "id" | "createdAt"> & { id?: number }): Promise<number> {
    const id = data.id ?? Date.now();
    await addDoc(landsCollection, { ...data, id, createdAt: new Date().toISOString() });
    return id;
}

export async function updateLand(id: number, updates: Partial<Land>): Promise<void> {
    const q = query(landsCollection, where("id", "==", id));
    const qs = await getDocs(q);
    if (qs.empty) return;
    const ref = qs.docs[0].ref;
    await updateDoc(ref, updates as any);
}

export async function deleteLand(id: number): Promise<void> {
    const q = query(landsCollection, where("id", "==", id));
    const qs = await getDocs(q);
    if (qs.empty) return;
    await deleteDoc(doc(db, "lands", qs.docs[0].id));
}


