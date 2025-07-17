import React from "react";
import type { PropertyStatus } from "../../types/property";

type BadgeProps = {
  status: PropertyStatus;
  className?: string;
};

function getStatusClass(status: PropertyStatus) {
  switch (status) {
    case "Lançamento":
      return "badge badge-blue";
    case "Em construção":
      return "badge badge-yellow";
    case "Finalizado":
      return "badge badge-green";
    default:
      return "badge";
  }
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => (
  <span className={`${getStatusClass(status)} ${className}`}>{status}</span>
);
