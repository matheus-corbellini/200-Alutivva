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
    <div className="property-details-header">
      <div className="container">
        <nav className="property-details-nav">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="back-button"
          >
            <MdArrowBack />
            <span>Voltar ao marketplace</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default PropertyDetailsHeader;
