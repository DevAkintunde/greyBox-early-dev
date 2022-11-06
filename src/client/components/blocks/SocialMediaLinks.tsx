import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhone,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import {
  brandEmail,
  brandWhatsapp,
  brandPhoneNo,
  brandYoutube,
  brandInstagram,
  brandFacebook,
  brandTwitter,
} from "../../utils/app.config";

const SocialMediaLinks = () => {
  let linkClasses = "bg-color-def block text-color-ter rounded-full p-2";
  return (
    <div className="absolute grid grid-flow-col gap-3 list-none top-2 right-[200%]">
      {brandPhoneNo ? (
        <li>
          <a
            href={"tel:+" + brandPhoneNo}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaPhone />
          </a>
        </li>
      ) : null}
      {brandWhatsapp ? (
        <li>
          <a
            href={"https://wa.me/" + brandWhatsapp}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaWhatsapp />
          </a>
        </li>
      ) : null}
      {brandEmail ? (
        <li>
          <a
            href={"mailto: " + brandEmail}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaEnvelope />
          </a>
        </li>
      ) : null}
      {brandYoutube ? (
        <li>
          <a
            href={brandYoutube}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaYoutube />
          </a>
        </li>
      ) : null}
      {brandTwitter ? (
        <li>
          <a
            href={"https://twitter.com/" + brandTwitter}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaTwitter />
          </a>
        </li>
      ) : null}
      {brandInstagram ? (
        <li>
          <a
            href={"https://instagram.com/" + brandInstagram}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaInstagram />
          </a>
        </li>
      ) : null}
      {brandFacebook ? (
        <li>
          <a
            href={"https://facebook.com/" + brandFacebook}
            target="_blank"
            rel="noreferrer"
            className={linkClasses}
          >
            <FaFacebook />
          </a>
        </li>
      ) : null}
    </div>
  );
};

export default SocialMediaLinks;
