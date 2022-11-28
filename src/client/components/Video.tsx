import React from "react";
import { Link } from "react-router-dom";

//display options: overlay|
export const Video = ({
  src,
  alt,
  modal,
  entityUrl,
  display,
}: {
  src: string;
  alt: string;
  modal?: boolean;
  entityUrl?: string;
  display?: string;
}) => {
  return (
    <>
      <iframe
        src={src}
        frameBorder="0"
        allowFullScreen
        title={alt}
        className="video-iframe"
      ></iframe>
      {entityUrl ? (
        <Link to={entityUrl}>
          <h6>{alt}</h6>
        </Link>
      ) : (
        <h6>{alt}</h6>
      )}
    </>
  );
};
