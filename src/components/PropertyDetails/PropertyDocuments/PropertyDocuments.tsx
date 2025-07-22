import React from "react";
import "./PropertyDocuments.css";
import { MdDownload } from "react-icons/md";

type PropertyDocumentsProps = {
  documents: {
    title: string;
    type: string;
    size: string;
    url: string;
    category: string;
  }[];
};

const PropertyDocuments: React.FC<PropertyDocumentsProps> = ({ documents }) => {
  return (
    <section className="property-documents">
      <h2 className="section-title">Documentos</h2>
      <div className="documents-grid">
        {documents.map((doc, index) => (
          <div key={index} className="document-item">
            <div className="document-icon">{doc.type}</div>
            <div className="document-info">
              <div className="document-title">{doc.title}</div>
              <div className="document-meta">
                {" "}
                {doc.type} • {doc.size}
              </div>
            </div>
            <a
              href={doc.url}
              className="document-download"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdDownload />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyDocuments;
