import { useState } from "react";
import reactLogo from "../../assets/react.svg";
import "../../App.css";
import { Previewer } from "../components/frontpage/Previewer";
import temp from "../../assets/temp.jpg";

export const Home = () => {
  return (
    <>
      <div className="grid grid-cols-5">
        <div className="bg-color-def col-span-3 w-full"></div>
        <Previewer />
      </div>
      <img src={temp} alt="template" />
    </>
  );
};
