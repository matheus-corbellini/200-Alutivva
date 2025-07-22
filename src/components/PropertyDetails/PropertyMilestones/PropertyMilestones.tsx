import React from "react";
import "./PropertyMilestones.css";

type PropertyMilestonesProps = {
  milestones: {
    title: string;
    date: string;
    status: "completed" | "in-progress" | "pending";
    description: string;
  }[];
};

const PropertyMilestones: React.FC<PropertyMilestonesProps> = ({
  milestones,
}) => {
  return (
    <section className="property-milestones">
      <h2 className="section-title">Cronograma de Projeto</h2>
      <div className="milestones-timeline">
        {milestones.map((milestone, index) => (
          <div key={index} className={`milestone-item ${milestone.status}`}>
            <div className="milestone-header">
              <span className="milestone-title">{milestone.title}</span>
              <span className="milestone-date">{milestone.date}</span>
            </div>
            <div className="milestone-content">
              <p className="milestone-description">{milestone.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyMilestones;
