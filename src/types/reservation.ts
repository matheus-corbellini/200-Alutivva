export type ReservationStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Reservation {
    id: string;
    propertyId: number;
    propertyTitle: string;
    quotaValue: number;
    quantity: number;
    totalAmount: number;
    roi?: number;
    createdAt: string; // ISO date
    status: ReservationStatus;
    userId?: string; // 🔑 Campo obrigatório para regras de segurança
}


