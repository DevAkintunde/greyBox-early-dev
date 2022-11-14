import React from "react";
import { Link } from "react-router-dom";
import { APP_ADDRESS } from "../utils/app.config";

export const Image = ({
  src,
  alt,
  modal,
  entityUrl,
}: {
  src: string;
  alt: string;
  modal?: boolean;
  entityUrl?: string;
}) => {
  return entityUrl ? (
    <Link to={entityUrl}>
      <img src={APP_ADDRESS + "/" + src} alt={alt} />
    </Link>
  ) : (
    <img src={APP_ADDRESS + "/" + src} alt={alt} />
  );
};
