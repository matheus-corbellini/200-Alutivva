/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useRental } from "../../hooks/useRental";
import type { ReservationStatus } from "../../types/reservation";
import Button from "../../components/Button/Button";
import { Footer } from "borderless";
import "./MyReservations.css";
import { useAuth } from "../../contexts/AuthContext";
import { listReservationsByUser } from "../../services/ReservationsService";

const statusLabels: Record<ReservationStatus, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Rejeitada",
    cancelled: "Cancelada",
};

export default function MyReservations() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rentalCtx: any = useRental();
    const { user } = useAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const reservations = (rentalCtx?.reservations ?? []) as { id: string; propertyTitle: string; status: ReservationStatus; quantity: number; totalAmount: number; createdAt: string; }[];
    const [filter, setFilter] = useState<"all" | ReservationStatus>("all");
    const [loading, setLoading] = useState(false);

    const items = useMemo(() => {
        const data = Array.isArray(reservations) ? reservations : [];
        return filter === "all" ? data : data.filter(r => r.status === filter);
    }, [filter, reservations]);

    useEffect(() => {
        const run = async () => {
            if (!user?.id || !rentalCtx?.addReservation) return;
            setLoading(true);
            try {
                const list = await listReservationsByUser(user.id);
                // sincroniza contexto simples
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                list.forEach((r) => rentalCtx.addReservation({ ...(r as any) }));
            } finally {
                setLoading(false);
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    return (
        <div className="my-reservations-page-wrapper">
            <div className="my-reservations-container">
                <div className="header">
                    <div className="title-wrap">
                        <h1>Minhas Reservas</h1>
                        <p className="subtitle">Acompanhe suas solicitações de reserva de cotas</p>
                    </div>
                    <div className="controls">
                        <label className="filter-label" htmlFor="resFilter">Filtrar</label>
                        <select id="resFilter" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
                            <option value="all">Todas</option>
                            <option value="pending">Pendentes</option>
                            <option value="approved">Aprovadas</option>
                            <option value="rejected">Rejeitadas</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    </div>
                </div>

                <div className="list">
                    {loading ? (
                        <div className="empty">Carregando...</div>
                    ) : items.length === 0 ? (
                        <div className="empty">Nenhuma reserva encontrada.</div>
                    ) : (
                        items.map((r) => (
                            <div key={r.id} className="card">
                                <div className="card-main">
                                    <h3>{r.propertyTitle}</h3>
                                    <span className={`badge ${r.status}`}>{statusLabels[r.status]}</span>
                                </div>
                                <div className="card-sub">
                                    <span>Qtd: {r.quantity}</span>
                                    <span>Total: R$ {r.totalAmount.toLocaleString()}</span>
                                    <span>Data: {new Date(r.createdAt).toLocaleDateString("pt-BR")}</span>
                                </div>
                                <div className="actions">
                                    <Button variant="secondary" size="small">Detalhes</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer theme="light" useGradient={false} backgroundColor="transparent" logoVariant="light" />
        </div>
    );
}


