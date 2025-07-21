import React from "react";
import "./PropertyGallery.css";

type PropertyGalleryProps = {
  gallery: string[];
  title: string;
};

const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  gallery,
  title,
}) => {
  return (
    <section className="property-gallery">
      <h2 className="section-title">Galeria de Imagens</h2>
      <div className="gallery-grid">
        {gallery.map((image, index) => (
          <div key={index} className="gallery-item">
            <img
              src={image || "/placeholder.svg"}
              alt={`${title} - Imagem ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyGallery;
