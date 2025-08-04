import React from "react";
import { Rocket, Hammer, CheckCircle } from "lucide-react";
import type { PropertyStatus } from "../../types/property";

type BadgeProps = {
  status: PropertyStatus;
  className?: string;
};

function getStatusConfig(status: PropertyStatus) {
  switch (status) {
    case "Lançamento":
      return {
        class: "badge badge-blue",
        icon: <Rocket size={12} />,
        label: "Lançamento"
      };
    case "Em construção":
      return {
        class: "badge badge-yellow",
        icon: <Hammer size={12} />,
        label: "Em construção"
      };
    case "Finalizado":
      return {
        class: "badge badge-green",
        icon: <CheckCircle size={12} />,
        label: "Finalizado"
      };
    default:
      return {
        class: "badge",
        icon: null,
        label: status
      };
  }
}

export const Badge: React.FC<BadgeProps> = ({ status, className }) => {
  const config = getStatusConfig(status);

  return (
    <span className={`${config.class} ${className}`}>
      {config.icon && <span className="badge-icon">{config.icon}</span>}
      <span className="badge-text">{config.label}</span>
    </span>
  );
};
