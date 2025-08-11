import { useEffect, useMemo, useState } from "react";
import { Footer } from "borderless";
import Button from "../../components/Button/Button";
import "./UserNotifications.css";
import { useAuth } from "../../contexts/AuthContext";
import { listNotifications, markAllAsRead, markAsRead } from "../../services/NotificationsService";

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    type: "system" | "reservation" | "project";
    createdAt: string;
    read: boolean;
};

export default function UserNotifications() {
    const { user } = useAuth();
    const [items, setItems] = useState<NotificationItem[]>([]);
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const list = useMemo(() => items.filter(i => (showUnreadOnly ? !i.read : true)), [items, showUnreadOnly]);

    useEffect(() => {
        const run = async () => {
            if (!user?.id) return;
            const data = await listNotifications(user.id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setItems(data as any);
        };
        run();
    }, [user?.id]);

    return (
        <div className="user-notifications-page-wrapper">
            <div className="user-notifications-container">
                <div className="header">
                    <h1>Notificações</h1>
                    <div className="actions">
                        <label className="checkbox"><input type="checkbox" checked={showUnreadOnly} onChange={(e) => setShowUnreadOnly(e.target.checked)} /> Não lidas</label>
                        <Button variant="secondary" size="small" onClick={async () => { if (!user?.id) return; await markAllAsRead(user.id); setItems(prev => prev.map(i => ({ ...i, read: true }))); }}>Marcar todas como lidas</Button>
                    </div>
                </div>
                <div className="list">
                    {list.length === 0 ? (
                        <div className="empty">Sem notificações.</div>
                    ) : (
                        list.map(n => (
                            <div key={n.id} className={`row ${n.read ? 'read' : 'unread'}`} onClick={async () => { await markAsRead(n.id); setItems(prev => prev.map(i => i.id === n.id ? { ...i, read: true } : i)); }}>
                                <div className="main">
                                    <h4>{n.title}</h4>
                                    <p>{n.message}</p>
                                </div>
                                <span className="time">{new Date(n.createdAt).toLocaleString('pt-BR')}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer theme="light" useGradient={false} backgroundColor="transparent" logoVariant="light" />
        </div>
    );
}


