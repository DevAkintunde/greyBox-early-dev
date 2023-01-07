import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "./routes/auth/AuthRouter";

const Router = () => {
  return (
    <Routes>
      <Route path="admin/*" element={<AuthRouter />} />
      {/* <Route path="account/*" element={<Login />} /> */}
    </Routes>
  );
};

export default Router;
