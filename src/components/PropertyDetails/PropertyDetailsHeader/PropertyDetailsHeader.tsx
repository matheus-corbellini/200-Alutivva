import React from "react";
import { MdArrowBack } from "react-icons/md";
import "./PropertyDetailsHeader.css";

type PropertyDetailsHeaderProps = {
  onBack: () => void;
};

const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({
  onBack,
}) => {
  return (
    <header className="property-details-header">
      <nav className="property-details-nav">
        <button
          onClick={onBack}
          className="back-button"
          type="button"
          aria-label="Voltar para o marketplace"
        >
          <MdArrowBack />
          <span>Voltar ao Marketplace</span>
        </button>
      </nav>
    </header>
  );
};

export default PropertyDetailsHeader;
