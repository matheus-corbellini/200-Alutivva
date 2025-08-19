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
    console.log("📊 listReturnsByUser: Buscando rendimentos para usuário:", userId);
    
    try {
        // Consulta sem orderBy para evitar necessidade de índice composto
        const q = query(
            collection(db, "returns"),
            where("userId", "==", userId)
        );
        
        const snap = await getDocs(q);
        const returns = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as ReturnRecord[];
        
        // Ordenação no cliente por data (mais recente primeiro)
        const sortedReturns = returns.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Descending order
        });
        
        console.log("✅ listReturnsByUser: Rendimentos carregados com sucesso:", sortedReturns.length);
        return sortedReturns;
    } catch (error) {
        console.error("❌ listReturnsByUser: Erro ao carregar rendimentos:", error);
        throw error;
    }
}


