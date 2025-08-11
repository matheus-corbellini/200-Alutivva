import { useMemo, useState } from "react";
import Button from "../../components/Button/Button";
import "./AdminDashboard.css";

type Audience = "all" | "investor" | "landowner" | "entrepreneur" | "admin";
type Channel = { push: boolean; email: boolean };

type SentItem = {
    id: string;
    title: string;
    message: string;
    audience: Audience;
    channels: Channel;
    createdAt: string;
    status: "sent" | "error";
};

export default function AdminNotifications() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState<Audience>("all");
    const [channels, setChannels] = useState<Channel>({ push: true, email: false });
    const [history, setHistory] = useState<SentItem[]>([]);

    const canSend = useMemo(() => title.trim() && message.trim(), [title, message]);

    const handleSend = () => {
        const item: SentItem = {
            id: String(Date.now()),
            title,
            message,
            audience,
            channels,
            createdAt: new Date().toISOString(),
            status: "sent",
        };
        setHistory(prev => [item, ...prev]);
        setTitle("");
        setMessage("");
    };

    return (
        <div className="admin-notifications-content">
            <div className="content-header">
                <h3>Criar Notificação</h3>
            </div>
            <div className="notification-form">
                <div className="inputs-grid">
                    <input className="nf-input" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea className="nf-input" placeholder="Mensagem" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="filters-grid">
                    <select className="nf-input" value={audience} onChange={(e) => setAudience(e.target.value as Audience)}>
                        <option value="all">Todos usuários</option>
                        <option value="investor">Investidores</option>
                        <option value="landowner">Proprietários</option>
                        <option value="entrepreneur">Empreendedores</option>
                        <option value="admin">Administradores</option>
                    </select>
                    <label className="nf-check"><input type="checkbox" checked={channels.push} onChange={(e) => setChannels(c => ({ ...c, push: e.target.checked }))} /> Push</label>
                    <label className="nf-check"><input type="checkbox" checked={channels.email} onChange={(e) => setChannels(c => ({ ...c, email: e.target.checked }))} /> E-mail</label>
                </div>
                <div className="send-row">
                    <Button className="send-btn" variant="primary" onClick={handleSend} disabled={!canSend}>Enviar</Button>
                </div>
            </div>

            <div className="projects-table">
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Mensagem</th>
                            <th>Alvo</th>
                            <th>Canais</th>
                            <th>Data</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(h => (
                            <tr key={h.id}>
                                <td>{h.title}</td>
                                <td>{h.message}</td>
                                <td>{h.audience}</td>
                                <td>{[h.channels.push && 'Push', h.channels.email && 'E-mail'].filter(Boolean).join(', ')}</td>
                                <td>{new Date(h.createdAt).toLocaleString('pt-BR')}</td>
                                <td><span className={`status-badge ${h.status === 'sent' ? 'green' : 'red'}`}>{h.status === 'sent' ? 'Enviado' : 'Erro'}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


