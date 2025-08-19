import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
    ownerId?: string; // 🔑 Campo obrigatório para regras de segurança
}

const db = getFirestore(app);
const auth = getAuth(app);
const landsCollection = collection(db, "lands");

export async function listLands(): Promise<Land[]> {
    console.log("🔍 listLands: Iniciando busca de terrenos");
    try {
        const snap = await getDocs(query(landsCollection, orderBy("createdAt", "desc")));
        console.log("✅ listLands: Terrenos carregados com sucesso");
        return snap.docs.map(d => ({ ...(d.data() as Land) }));
    } catch (error) {
        console.error("❌ listLands: Erro ao carregar terrenos:", error);
        throw error;
    }
}

export async function createLand(data: Omit<Land, "id" | "createdAt"> & { id?: number }): Promise<number> {
    console.log("🏗️ createLand: Iniciando criação de terreno");
    console.log("📋 createLand: Dados recebidos:", data);
    
    const user = auth.currentUser;
    if (!user) {
        console.error("❌ createLand: Usuário não autenticado");
        throw new Error("Usuário não autenticado");
    }
    
    console.log("👤 createLand: Usuário autenticado:", user.uid);

    const id = data.id ?? Date.now();
    const payload = { 
        ...data, 
        id, 
        createdAt: new Date().toISOString(),
        ownerId: user.uid // 🔑 Adiciona o UID do usuário logado
    };
    
    console.log("📦 createLand: Payload final:", payload);
    
    try {
        const docRef = await addDoc(landsCollection, payload);
        console.log("✅ createLand: Terreno criado com sucesso, docId:", docRef.id);
        return id;
    } catch (error) {
        console.error("❌ createLand: Erro ao criar terreno:", error);
        throw error;
    }
}

export async function updateLand(id: number, updates: Partial<Land>): Promise<void> {
    console.log("🔄 updateLand: Atualizando terreno ID:", id);
    try {
        const q = query(landsCollection, where("id", "==", id));
        const qs = await getDocs(q);
        if (qs.empty) {
            console.warn("⚠️ updateLand: Terreno não encontrado");
            return;
        }
        const ref = qs.docs[0].ref;
        await updateDoc(ref, updates as any);
        console.log("✅ updateLand: Terreno atualizado com sucesso");
    } catch (error) {
        console.error("❌ updateLand: Erro ao atualizar terreno:", error);
        throw error;
    }
}

export async function deleteLand(id: number): Promise<void> {
    console.log("🗑️ deleteLand: Deletando terreno ID:", id);
    try {
        const q = query(landsCollection, where("id", "==", id));
        const qs = await getDocs(q);
        if (qs.empty) {
            console.warn("⚠️ deleteLand: Terreno não encontrado");
            return;
        }
        await deleteDoc(doc(db, "lands", qs.docs[0].id));
        console.log("✅ deleteLand: Terreno deletado com sucesso");
    } catch (error) {
        console.error("❌ deleteLand: Erro ao deletar terreno:", error);
        throw error;
    }
}


