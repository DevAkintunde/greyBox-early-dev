import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "./auth/AuthRouter";
import { FormTest } from "./Misc/FormTest";
import { StaffLogin } from "./Misc/StaffLogin";

export const Router = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="auth/*" element={<AuthRouter />} />
        <Route path="account/*" element={<StaffLogin />} />
        <Route path="test" element={<FormTest />} />
      </Routes>
    </div>
  );
};
