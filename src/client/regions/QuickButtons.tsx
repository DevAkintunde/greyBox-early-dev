import React from "react";
import { useLocation } from "react-router-dom";
import UserMenu from "../components/auth/UserMenu";
import ContactButton from "../components/blocks/ContactButton";

const QuickButtons = () => {
  let location = useLocation();
  return (
    <div>{location.pathname === "/" ? <ContactButton /> : <UserMenu />}</div>
  );
};

export default QuickButtons;
