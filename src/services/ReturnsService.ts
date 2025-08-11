import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import app from "../lib/firebaseConfig";

export interface ReturnRecord {
    id: string;
    userId: string;
    propertyName: string;
    date: string; // ISO string
    initialValue: number;
    currentValue: number;
    returnPercentage: number; // derived or stored
    returnAmount: number; // derived or stored
    period?: string;
    status: "positive" | "negative" | "neutral";
}

const db = getFirestore(app);

export async function listReturnsByUser(userId: string): Promise<ReturnRecord[]> {
    const q = query(
        collection(db, "returns"),
        where("userId", "==", userId),
        orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as ReturnRecord[];
}


