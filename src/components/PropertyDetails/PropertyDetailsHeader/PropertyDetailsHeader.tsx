import React from 'react';
import './PropertyDetailsHeader.css';

interface PropertyDetailsHeaderProps {
    title: string;
    location: string;
    price: number;
    status: string;
}

const PropertyDetailsHeader: React.FC<PropertyDetailsHeaderProps> = ({
    title,
    location,
    price,
    status
}) => {
    return (
        <div className="property-details-header">
            <div className="header-content">
                <h1 className="property-title">{title}</h1>
                <p className="property-location">{location}</p>
                <div className="property-price">
                    <span className="price-label">Preço:</span>
                    <span className="price-value">R$ {price.toLocaleString()}</span>
                </div>
                <div className="property-status">
                    <span className={`status-badge status-${status.toLowerCase()}`}>
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsHeader;
