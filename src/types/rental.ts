export interface Rental {
  id: string;
  title: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  monthlyRent: number;
  deposit: number;
  businessType: "daily_rent" | "sale";
  status: "active" | "pending" | "expired" | "cancelled";
  dailyRate: number;
  salePrice?: number;
  amenities: string[];
  maxGuests: number;
  checkInTime: string;
  checkOutTime: string;
  instantBooking: boolean;
  cleaningFee: number;
  serviceFee: number;
} 