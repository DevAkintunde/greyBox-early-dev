import React from "react";
import { Link } from "react-router-dom";
import { APP_ADDRESS } from "../utils/app.config";

export const Image = ({
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
  return entityUrl ? (
    <Link to={entityUrl}>
      <img src={APP_ADDRESS + "/" + src} alt={alt} />
      <h6>{alt}</h6>
    </Link>
  ) : (
    <>
      <img src={APP_ADDRESS + "/" + src} alt={alt} />
      <h6>{alt}</h6>
    </>
  );
};
