import { createContext } from "react";
import type { Rental } from "../types/rental";

interface RentalContextType {
  rentals: Rental[];
  addRental: (rental: Rental) => void;
  updateRental: (id: string, updates: Partial<Rental>) => void;
  deleteRental: (id: string) => void;
}

export const RentalContext = createContext<RentalContextType | undefined>(undefined); 