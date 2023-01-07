import React from "react";
import bgImage from "../../assets/lens-contour2.png";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { AdminLogin } from "./routes/Misc/AdminLogin";
import { AuthRouter } from "./AuthRouter";
import UserMenu from "./components/nav/UserMenu";

export const Cms = () => {
  return (
    <div id='cms'
      style={{
        backgroundImage: "url(" + bgImage + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "left",
        backgroundBlendMode: "overlay",
        backgroundAttachment: 'fixed',
        backgroundColor: '#eeefe8',
      }}
      className='rounded-md'
    >
      <Routes>
        <Route path="*" index element={<AdminLogin />} />
        <Route path="auth/*" element={<AuthRouter />} />
      </Routes>
      <UserMenu />

      <ToastContainer
        position="top-right"
        autoClose={10000}
        closeOnClick={false}
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
