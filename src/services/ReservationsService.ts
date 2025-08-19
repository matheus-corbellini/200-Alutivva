import { getFirestore, addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../lib/firebaseConfig";
import type { Reservation, ReservationStatus } from "../types/reservation";

const db = getFirestore(app);
const auth = getAuth(app);

export async function createReservation(data: Omit<Reservation, "id" | "createdAt">) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    const ref = await addDoc(collection(db, "reservations"), {
        ...data,
        createdAt: serverTimestamp(),
        userId: user.uid // 🔑 Adiciona o UID do usuário logado
    });
    return ref.id;
}

export async function listReservationsByUser(userId: string) {
    const q = query(collection(db, "reservations"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Reservation[];
}

export async function updateReservation(id: string, status: ReservationStatus) {
    await updateDoc(doc(db, "reservations", id), { status });
}

export async function listAllReservations(): Promise<Reservation[]> {
    const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Reservation[];
}


