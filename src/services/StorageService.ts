import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../lib/firebaseConfig";

const storage = getStorage(app);

export async function uploadImage(file: File, folder: string): Promise<string> {
    console.log("📤 uploadImage: Iniciando upload de imagem");
    console.log("📁 uploadImage: Pasta:", folder);
    console.log("📄 uploadImage: Arquivo:", file.name, "Tamanho:", file.size);
    
    try {
        const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
        const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}_${safeName}`;
        console.log("🛤️ uploadImage: Caminho:", path);
        
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
        console.log("✅ uploadImage: Upload concluído");
        
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("🔗 uploadImage: URL gerada:", downloadURL);
        
        return downloadURL;
    } catch (error) {
        console.error("❌ uploadImage: Erro no upload:", error);
        throw error;
    }
}


