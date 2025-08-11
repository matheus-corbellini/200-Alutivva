import { getFirestore, collection, getDocs, query, where, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import app from "../lib/firebaseConfig";

export type QuotaStatus = "available" | "reserved" | "sold" | "blocked";

export interface QuotaRecord {
    id: string;
    projectId: string;
    projectTitle: string;
    quotaNumber: string;
    value: number;
    status: QuotaStatus;
    reservedBy?: string;
    reservedAt?: string; // ISO
    soldAt?: string; // ISO
    soldTo?: string;
    soldValue?: number;
    createdAt?: any;
}

const db = getFirestore(app);

export async function listQuotas(projectId?: string): Promise<QuotaRecord[]> {
    const base = collection(db, "quotas");
    const q = projectId
        ? query(base, where("projectId", "==", projectId), orderBy("quotaNumber", "asc"))
        : query(base, orderBy("quotaNumber", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as QuotaRecord[];
}

export async function createQuota(data: Omit<QuotaRecord, "id" | "createdAt">): Promise<string> {
    const ref = await addDoc(collection(db, "quotas"), { ...data, createdAt: serverTimestamp() });
    return ref.id;
}

export async function updateQuota(id: string, updates: Partial<QuotaRecord>): Promise<void> {
    await updateDoc(doc(db, "quotas", id), updates as any);
}

export async function deleteQuota(id: string): Promise<void> {
    await deleteDoc(doc(db, "quotas", id));
}


