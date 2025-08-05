import { createContext } from 'react';
import type { Rental } from '../types/rental';

interface RentalContextType {
  rentalCount: number;
  setRentalCount: (count: number) => void;
  updateRentalCount: () => void;
  rentals: Rental[];
  setRentals: (rentals: Rental[]) => void;
}

export const RentalContext = createContext<RentalContextType | undefined>(undefined); 