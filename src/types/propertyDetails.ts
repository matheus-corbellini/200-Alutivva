import type { Property } from "./property";

export interface PropertyDetails extends Property {
  gallery: string[];
  videos: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  floorPlans: {
    title: string;
    image: string;
    area: string;
    rooms: number;
    bathrooms: number;
  }[];
  financialProjection: {
    investmentValue: number;
    monthlyReturn: number;
    annualReturn: number;
    roi: number;
    paybackPeriod: number;
    projectedAppreciation: number;
    timeline: {
      year: number;
      value: number;
      return: number;
    }[];
  };
  milestones: {
    title: string;
    date: string;
    status: "completed" | "in-progress" | "pending";
    description: string;
  }[];
  documents: {
    title: string;
    type: string;
    size: string;
    url: string;
    category: "projeto" | "legal" | "financeiro";
  }[];
  amenities: string[];
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    nearbyPlaces: {
      name: string;
      distance: string;
      type: string;
    }[];
  };
  developer: {
    name: string;
    logo: string;
    description: string;
    projects: number;
    rating: number;
  };
  risks: {
    level: "baixo" | "médio" | "alto";
    title: string;
    description: string;
  }[];
}
