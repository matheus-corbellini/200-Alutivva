import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../lib/firebaseConfig";
import type { Rental } from "../types/rental";

const db = getFirestore(app);
const auth = getAuth(app);
const rentalsCollection = collection(db, "rentals");

export async function listRentals(): Promise<Rental[]> {
    const snap = await getDocs(query(rentalsCollection, orderBy("createdAt", "desc")));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as unknown as Rental[];
}

export async function createRental(data: Omit<Rental, "id">): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const docRef = await addDoc(rentalsCollection, { 
        ...data, 
        createdAt: new Date().toISOString(),
        ownerId: user.uid // 🔑 Adiciona o UID do usuário logado
    });
    return docRef.id;
}

export async function updateRentalById(id: string, updates: Partial<Rental>): Promise<void> {
    const ref = doc(db, "rentals", id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(ref, updates as any);
}

export async function deleteRentalById(id: string): Promise<void> {
    await deleteDoc(doc(db, "rentals", id));
}


