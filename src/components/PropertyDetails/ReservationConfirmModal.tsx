import React, { useState } from "react";
import Button from "../Button/Button";
import { formatCurrency } from "../../utils/currency";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    propertyTitle: string;
    quotaValue: number;
    roi?: number;
};

export const ReservationConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, propertyTitle, quotaValue, roi }) => {
    const [quantity, setQuantity] = useState<number>(1);
    if (!isOpen) return null;

    const total = quotaValue * quantity;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Confirmar reserva de cota</h2>
                    <button className="modal-close" onClick={onClose}>x</button>
                </div>
                <div className="modal-body">
                    <p><strong>Empreendimento:</strong> {propertyTitle}</p>
                    <p><strong>Valor da cota:</strong> {formatCurrency(quotaValue)}</p>
                    {typeof roi === 'number' && <p><strong>ROI estimado:</strong> {roi}% a.a.</p>}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                        <label>Quantidade:</label>
                        <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <strong>Total:</strong> {formatCurrency(total)}
                    </div>
                </div>
                <div className="modal-footer">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={() => onConfirm(quantity)}>Confirmar</Button>
                </div>
            </div>
        </div>
    );
};

export default ReservationConfirmModal;


