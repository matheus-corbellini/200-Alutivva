import type { FieldValue, Timestamp } from "firebase/firestore";

export const UserRole = {
  INVESTOR: "investor",
  LANDOWNER: "landowner",
  ENTREPRENEUR: "entrepreneur",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: Timestamp | FieldValue;
};
