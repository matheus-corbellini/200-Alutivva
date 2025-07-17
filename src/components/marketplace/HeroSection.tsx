import React from "react";

type HeroSectionProps = {
  title: string;
  description: string;
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
}) => (
  <div className="hero-section">
    <h2 className="hero-title">{title}</h2>
    <p className="hero-description">{description}</p>
  </div>
);
