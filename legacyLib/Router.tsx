import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "../src/client/_cms/AuthRouter";
import { FormTest } from "../src/client/_cms/routes/Misc/FormTest";
import { StaffLogin } from "../src/client/_cms/routes/Misc/AdminLogin";

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
