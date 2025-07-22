import React from "react";
import "./PropertyLocation.css";
import { MdLocationOn } from "react-icons/md";

type NearbyPlace = {
  name: string;
  distance: string;
  type: string;
};

type PropertyLocationProps = {
  location: {
    address: string;
    nearbyPlaces: NearbyPlace[];
  };
};

const PropertyLocation: React.FC<PropertyLocationProps> = ({ location }) => {
  return (
    <section className="property-location">
      <h2 className="section-title">Localização</h2>
      <div className="location-address">{location.address}</div>
      <div className="nearby-places">
        {location.nearbyPlaces.map((place, index) => (
          <div key={index} className="nearby-item">
            <MdLocationOn className="nearby-icon" />
            <div className="nearby-info">
              <div className="nearby-name">{place.name}</div>
              <div className="nearby-distance">{place.distance}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyLocation;
