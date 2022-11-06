import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "./auth/AuthRouter";
import { StaffLogin } from "./Misc/StaffLogin";

export const Router = () => {
  return (
    <div className="w-[90%] sm:w-[80%] lg:w-[70%] mx-auto mt-32">
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />
        <Route path="account/*" element={<StaffLogin />} />
      </Routes>
    </div>
  );
};