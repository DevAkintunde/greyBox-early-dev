import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Media from "./entities/Media";
import Pages from "./entities/Pages";
import Services from "./entities/Services";
import { MailForm } from "../../components/auth/form/MailForm";
import { Staffs } from "./users/Staffs";
import { Profile as UserProfile } from "../../global/AppFrame";
import { Accounts } from "./users/Accounts";
import { Dashboard } from "./users/Dashboard";
import { Profile } from "./users/Profile";
import Bin from "./entities/Bin";

export const AuthRouter = () => {
  const { profile }: any = useContext(UserProfile);

  const navigate = useNavigate();
  useEffect(() => {
    if (profile && profile.status === false) navigate("/");
  }, [navigate, profile]);

  return (
    <Routes>
      <Route path={"/"} index element={<Dashboard />} />
      <Route path="profile/*" index element={<Profile />} />
      <Route path="accounts/*" element={<Accounts />} />
      <Route path="services/*" element={<Services />} />
      <Route path="media/*" element={<Media />} />
      <Route path="pages/*" element={<Pages />} />
      <Route path="bin/*" element={<Bin />} />
      <Route path="staffs/*" element={<Staffs />} />
      <Route path="send-mail" element={<MailForm />} />
    </Routes>
  );
};
