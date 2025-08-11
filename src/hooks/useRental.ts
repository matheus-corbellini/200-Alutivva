import { useContext } from 'react';
import { RentalContext } from '../contexts/RentalContext';
import { RentalContext as RentalContextValue } from '../contexts/RentalContextValue';

export const useRental = () => {
  // Preferir contexto novo; manter compat com antigo
  const valueCtx = useContext(RentalContextValue as unknown as React.Context<any>);
  if (valueCtx) return valueCtx;

  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context as unknown as typeof valueCtx;
};