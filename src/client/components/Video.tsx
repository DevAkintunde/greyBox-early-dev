import React from "react";

//display options: overlay|
export const Video = ({
  src,
  alt,
  modal,
  display,
}: {
  src: string;
  alt: string;
  modal?: boolean;
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
      <h6>{alt}</h6>
    </>
  );
};
