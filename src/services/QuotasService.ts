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
    console.log("📊 listQuotas: Buscando cotas, projectId:", projectId);
    
    try {
        const base = collection(db, "quotas");
        let q;
        
        if (projectId) {
            // Consulta com filtro por projectId
            q = query(base, where("projectId", "==", projectId));
        } else {
            // Consulta sem filtros
            q = query(base);
        }
        
        const snap = await getDocs(q);
        const quotas = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as QuotaRecord[];
        
        // Ordenação no cliente por número da cota
        const sortedQuotas = quotas.sort((a, b) => {
            const quotaA = parseInt(a.quotaNumber) || 0;
            const quotaB = parseInt(b.quotaNumber) || 0;
            return quotaA - quotaB; // Ascending order
        });
        
        console.log("✅ listQuotas: Cotas carregadas com sucesso:", sortedQuotas.length);
        return sortedQuotas;
    } catch (error) {
        console.error("❌ listQuotas: Erro ao carregar cotas:", error);
        throw error;
    }
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


