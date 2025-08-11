import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "../lib/firebaseConfig";

const storage = getStorage(app);

export async function uploadImage(file: File, folder: string): Promise<string> {
    const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}_${safeName}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
    return await getDownloadURL(snapshot.ref);
}


