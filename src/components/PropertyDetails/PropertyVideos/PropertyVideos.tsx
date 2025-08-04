import React from "react";
import "./PropertyVideos.css";
import { MdPlayArrow } from "react-icons/md";

type PropertyVideosProps = {
  videos: { title: string; url: string; thumbnail: string }[];
  title?: string;
  onSelectVideo: (url: string) => void;
};

const PropertyVideos: React.FC<PropertyVideosProps> = ({
  videos,
  onSelectVideo,
}) => {
  return (
    <section className="property-videos">
      <h2 className="section-title">Videos</h2>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <div
              className="video-thumbnail"
              onClick={() => onSelectVideo(video.url)}
            >
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
              />
              <div className="video-preview-overlay">
                <div className="video-preview-text">
                  Clique para assistir
                </div>
              </div>
              <button className="play-button">
                <MdPlayArrow />
              </button>
            </div>
            <div className="video-title">{video.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyVideos;
