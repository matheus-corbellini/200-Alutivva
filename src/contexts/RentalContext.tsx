import React, { useState } from 'react';
import type { ReactNode } from 'react';
import type { Rental } from '../types/rental';
import { RentalContext } from './RentalContextValue';

interface RentalProviderProps {
  children: ReactNode;
}

export const RentalProvider: React.FC<RentalProviderProps> = ({ children }) => {
  const [rentals, setRentals] = useState<Rental[]>([
    {
      id: 1,
      title: "Apartamento Centro",
      address: "Rua das Flores, 123 - Centro, São Paulo, SP",
      tenant: "Maria Silva",
      tenantPhone: "+55 (11) 99999-8888",
      tenantEmail: "maria.silva@email.com",
      monthlyRent: 2500,
      deposit: 5000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "active",
      propertyType: "Apartamento",
      area: "65m²",
      bedrooms: 2,
      bathrooms: 1,
      description: "Apartamento bem localizado, próximo ao metrô e comércio",
      documents: ["Contrato.pdf", "Comprovante.pdf"]
    }
  ]);

  const [rentalCount, setRentalCount] = useState(rentals.length);

  const updateRentalCount = () => {
    setRentalCount(rentals.length);
  };

  return (
    <RentalContext.Provider value={{
      rentalCount,
      setRentalCount,
      updateRentalCount,
      rentals,
      setRentals
    }}>
      {children}
    </RentalContext.Provider>
  );
}; 