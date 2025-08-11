import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Reservation } from '../types/reservation';

interface Rental {
    id: string;
    status: 'active' | 'inactive';
    // Add other rental properties as needed
}

interface RentalContextType {
    rentals: Rental[];
    setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
    reservations: Reservation[];
    addReservation: (r: Reservation) => void;
    updateReservationStatus: (id: string, status: Reservation['status']) => void;
}

export const RentalContext = createContext<RentalContextType | undefined>(undefined);

interface RentalProviderProps {
    children: ReactNode;
}

export const RentalProvider: React.FC<RentalProviderProps> = ({ children }) => {
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const addReservation = (r: Reservation) => {
        setReservations(prev => [r, ...prev]);
    };

    const updateReservationStatus = (id: string, status: Reservation['status']) => {
        setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res));
    };

    return (
        <RentalContext.Provider value={{ rentals, setRentals, reservations, addReservation, updateReservationStatus }}>
            {children}
        </RentalContext.Provider>
    );
};
