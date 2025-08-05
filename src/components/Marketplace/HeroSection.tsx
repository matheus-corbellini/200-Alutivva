import React from "react";
import Button from "../Button/Button";
import { MdAdd } from "react-icons/md";

type HeroSectionProps = {
  title: string;
  description: string;
  onAddProperty?: () => void;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  onAddProperty,
}) => (
  <div className="hero-section">
    <div className="hero-content">
      <div className="hero-text">
        <h2 className="hero-title">{title}</h2>
        <p className="hero-description">{description}</p>
      </div>
      {onAddProperty && (
        <Button
          variant="primary"
          onClick={onAddProperty}
          className="add-property-button"
        >
          <MdAdd size={20} />
          Adicionar Empreendimento
        </Button>
      )}
    </div>
  </div>
);
