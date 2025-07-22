import React, { useState } from "react";
import "./PropertyGallery.css";

type PropertyGalleryProps = {
  gallery: string[];
  title: string;
};

const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  gallery,
  title,
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
    setLoadingImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleImageLoadStart = (index: number) => {
    setLoadingImages((prev) => new Set(prev).add(index));
  };

  return (
    <section className="property-gallery">
      <h2 className="section-title">Galeria de Imagens</h2>
      <div className="gallery-grid">
        {gallery.map((image, index) => (
          <div key={index} className="gallery-item">
            {loadingImages.has(index) && (
              <div className="image-loading">
                <div className="image-spinner"></div>
              </div>
            )}
            <img
              src={
                imageErrors.has(index)
                  ? "/placeholder.svg"
                  : image || "/placeholder.svg"
              }
              alt={`${title} - Imagem ${index + 1}`}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              onLoadStart={() => handleImageLoadStart(index)}
              style={{
                display: loadingImages.has(index) ? "none" : "block",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyGallery;
