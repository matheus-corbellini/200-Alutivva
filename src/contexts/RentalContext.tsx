import React, { createContext, useState } from "react";
import type { Rental } from "../types/rental";

interface RentalContextType {
  rentals: Rental[];
  addRental: (rental: Rental) => void;
  updateRental: (id: string, updates: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
}

export const RentalContext = createContext<RentalContextType | undefined>(undefined);

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const addRental = (rental: Rental) => {
    setRentals(prev => [...prev, rental]);
  };

  const updateRental = (id: string, updates: Partial<Rental>) => {
    setRentals(prev => prev.map(rental =>
      rental.id === id ? { ...rental, ...updates } : rental
    ));
  };

  const deleteRental = (id: string) => {
    setRentals(prev => prev.filter(rental => rental.id !== id));
  };

  return (
    <RentalContext.Provider value={{ rentals, addRental, updateRental, deleteRental }}>
      {children}
    </RentalContext.Provider>
  );
}; 