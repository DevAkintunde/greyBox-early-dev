import React from "react";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./users/Dashboard";
import Media from "./entities/Media";
import Pages from "./entities/Pages";
import Services from "./entities/Services";
import { Account } from "./users/Account";
import { MailForm } from "./forms/MailForm";
import { Staffs } from "./users/Staffs";

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="services/*" element={<Services />} />
      <Route path="media/*" element={<Media />} />
      <Route path="pages/*" element={<Pages />} />
      <Route path="account/*" element={<Account />} />
      <Route path="staffs/*" element={<Staffs />} />
      <Route path="send-mail" element={<MailForm />} />
    </Routes>
  );
};
