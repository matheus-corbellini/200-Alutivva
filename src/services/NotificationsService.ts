import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import app from "../lib/firebaseConfig";

const db = getFirestore(app);

export type NotificationRecord = {
    id: string;
    userId: string; // destinatário; para broadcast, crie uma por usuário
    title: string;
    message: string;
    type: "system" | "reservation" | "project";
    read: boolean;
    createdAt?: any;
};

export async function sendNotification(n: Omit<NotificationRecord, "id" | "createdAt" | "read">) {
    const ref = await addDoc(collection(db, "notifications"), { ...n, read: false, createdAt: serverTimestamp() });
    return ref.id;
}

export async function listNotifications(userId: string, onlyUnread = false) {
    const base = query(collection(db, "notifications"), where("userId", "==", userId));
    const snap = await getDocs(base);
    const all = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as NotificationRecord[];
    return onlyUnread ? all.filter(n => !n.read) : all;
}

export async function markAllAsRead(userId: string) {
    const items = await listNotifications(userId);
    await Promise.all(items.filter(i => !i.read).map(i => updateDoc(doc(db, "notifications", i.id), { read: true })));
}

export async function markAsRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
}


