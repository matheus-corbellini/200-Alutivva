export interface Rental {
  id: number;
  title: string;
  address: string;
  tenant: string;
  tenantPhone: string;
  tenantEmail: string;
  monthlyRent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  status: "active" | "pending" | "expired" | "cancelled";
  propertyType: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  documents: string[];
} 