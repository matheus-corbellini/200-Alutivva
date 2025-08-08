import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface Rental {
    id: string;
    status: 'active' | 'inactive';
    // Add other rental properties as needed
}

interface RentalContextType {
    rentals: Rental[];
    setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
}

export const RentalContext = createContext<RentalContextType | undefined>(undefined);

interface RentalProviderProps {
    children: ReactNode;
}

export const RentalProvider: React.FC<RentalProviderProps> = ({ children }) => {
    const [rentals, setRentals] = useState<Rental[]>([]);

    return (
        <RentalContext.Provider value={{ rentals, setRentals }}>
            {children}
        </RentalContext.Provider>
    );
};
