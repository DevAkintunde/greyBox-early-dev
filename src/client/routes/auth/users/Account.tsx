import React from "react";
import { Route, Routes } from "react-router-dom";
import { AccountCreationForm } from "../forms/AccountCreationForm";
import { PasswordForm } from "../forms/PasswordForm";
import { ProfileForm } from "../forms/ProfileForm";
import { Dashboard } from "./Dashboard";

export const Account = () => {
  return (
    <Routes>
      <Route path={"/"} index element={<Dashboard />} />
      <Route path="update" element={<ProfileForm />} />
      <Route path="update-password" element={<PasswordForm />} />
      <Route path="create-account" element={<AccountCreationForm />} />
    </Routes>
  );
};
/* const UpdatePassword = () => {
  return <></>;
}; */
