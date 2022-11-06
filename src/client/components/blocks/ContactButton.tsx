import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jsStyler } from "../../global/functions/jsStyler";
import { ContactForm } from "./ContactForm";
//import { FaGripLines } from "react-icons/fa";

const ContactButton = () => {
  const location = useLocation();
  const contactButton = (
    <>
      <input
        value={"Contact"}
        id="contactButton"
        type="button"
        className="text-xl first-letter:text-2xl font-extrabold"
      />
      <div
        id="contactButton"
        className={
          "-z-10 absolute -left-3 -top-2 bg-color-pri border-8 border-color-ter/30 p-4 rounded-full"
        }
      />
    </>
  );
  useEffect(() => {
    if (location.pathname) {
      let targetElement = document.querySelector(
        `[jsstyler-toggle=contactButton]`
      );
      if (targetElement && targetElement.classList.contains("show")) {
        targetElement.classList.remove("show");
      }
    }
  }, [location.pathname]);

  const closeModal = () => {
    let targetElement = document.querySelector(
      `[jsstyler-toggle=contactButton]`
    );
    if (targetElement && targetElement.classList.contains("show")) {
      targetElement.classList.remove("show");
    }
  };

  return (
    <nav className="jsstyler toggle fixed z-50 right-5 bottom-5 bg-color-def">
      <button id="contactButton" className="p-1 relative" onClick={jsStyler()}>
        {contactButton}
      </button>

      <div
        className="fixed bg-color-pri/70 border-8 border-color-ter shadow-sm top-5 left-5 right-5 bottom-5 mx-auto w-[50%]"
        //tabIndex={-1}
        jsstyler-toggle="contactButton"
      >
        <div className="flex items-center justify-between p-4">
          <div className="text-color-ter text-xl mb-0 font-semibold">
            Send Us A Message
          </div>
          <button type="button" className="py-2 px-4" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="flex-grow list-none overflow-y-auto scrollbar">
          <ContactForm />
        </div>
      </div>
    </nav>
  );
};

export default ContactButton;
