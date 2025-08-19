import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../lib/firebaseConfig";
import type { Property } from "../types/property";

const db = getFirestore(app);
const auth = getAuth(app);
const propertiesCollection = collection(db, "properties");

export async function listProperties(): Promise<Property[]> {
    const snap = await getDocs(propertiesCollection);
    return snap.docs.map(d => {
        const data = d.data() as any;
        const numericId = Number(d.id);
        const id = data.id ?? (Number.isFinite(numericId) ? numericId : 0);
        return { id, ...data } as Property;
    });
}

// Mesmo que listProperties, porém incluindo o docId para operações de update/delete
export async function listPropertiesWithDocId(): Promise<(Property & { docId: string })[]> {
    const snap = await getDocs(propertiesCollection);
    return snap.docs.map(d => {
        const data = d.data() as any;
        const numericId = Number(d.id);
        const id = data.id ?? (Number.isFinite(numericId) ? numericId : 0);
        return { docId: d.id, id, ...data } as Property & { docId: string };
    });
}

export async function getPropertyByNumericId(id: number): Promise<Property | null> {
    const q = query(propertiesCollection, where("id", "==", id), limit(1));
    const s = await getDocs(q);
    if (s.empty) return null;
    const d = s.docs[0];
    return { ...(d.data() as any) } as Property;
}

export async function createProperty(data: Omit<Property, "id"> & { id?: number }): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const payload = { 
        ...data, 
        id: data.id ?? Date.now(),
        ownerId: user.uid // 🔑 Adiciona o UID do usuário logado
    } as any;
    
    const ref = await addDoc(propertiesCollection, payload);
    return ref.id;
}

export async function updateProperty(docId: string, updates: Partial<Property>): Promise<void> {
    await updateDoc(doc(db, "properties", docId), updates as any);
}

export async function deleteProperty(docId: string): Promise<void> {
    await deleteDoc(doc(db, "properties", docId));
}


