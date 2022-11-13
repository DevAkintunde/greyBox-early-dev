import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Media from "./entities/Media";
import Pages from "./entities/Pages";
import Services from "./entities/Services";
import { Account } from "./users/Account";
import { MailForm } from "./forms/MailForm";
import { Staffs } from "./users/Staffs";
import { Profile } from "../../global/AppFrame";

export const AuthRouter = () => {
  const { profile }: any = useContext(Profile);

  const navigate = useNavigate();
  useEffect(() => {
    if (profile && profile.status === false) navigate("/");
  }, [navigate, profile]);

  return (
    <Routes>
      <Route path="/*" index element={<Account />} />
      <Route path="services/*" element={<Services />} />
      <Route path="media/*" element={<Media />} />
      <Route path="pages/*" element={<Pages />} />
      <Route path="staffs/*" element={<Staffs />} />
      <Route path="send-mail" element={<MailForm />} />
    </Routes>
  );
};
