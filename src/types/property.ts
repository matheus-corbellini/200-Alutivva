export type PropertyStatus = "Lançamento" | "Em construção" | "Finalizado";
export type PropertyType = "Residencial" | "Comercial" | "Hoteleiro";
export type PropertyRegion = "RJ" | "SP" | "PE";

export interface Property {
  id: number;
  title: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    nearbyPlaces: {
      name: string;
      distance: string;
      type: string;
    }[];
  };
  type: PropertyType;
  roi: number;
  quotaValue: number;
  totalQuotas: number;
  soldQuotas: number;
  status: PropertyStatus;
  completionDate: string;
  image: string;
  description: string;
  expectedReturn: string;
  ownerId?: string; // 🔑 Campo obrigatório para regras de segurança
}

export interface Filters {
  region: string;
  type: string;
  maxValue: string;
  minValue: string;
  minRoi: string;
  search: string;
}

export type BadgeVariant = "blue" | "yellow" | "green" | "default";
