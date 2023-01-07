import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Media from "./routes/auth/entities/Media";
import Pages from "./routes/auth/entities/nodes/Pages";
import { Profile as UserProfile } from "./global/AuthFrame";
import { AdminAccounts } from "./routes/auth/accounts/AdminAccounts";
import { Dashboard } from "./routes/auth/user/Dashboard";
import { Profile } from "./routes/auth/user/Profile";
import Bin from "./routes/auth/entities/Bin";
import { MailForm } from "./components/forms/auth/MailForm";
import Blog from "./routes/auth/entities/nodes/Blog";

export const AuthRouter = () => {
  const { profile }: any = useContext(UserProfile);
  //console.log('profile', profile)
  const navigate = useNavigate();
  useEffect(() => {
    if (profile && profile.status === false) navigate("/");
  }, [navigate, profile]);

  return (
    <Routes>
      <Route path={"/"} index element={<Dashboard />} />
      <Route path={"/dashboard"} index element={<Dashboard />} />
      <Route path="profile/*" index element={<Profile />} />
      <Route path="accounts/*" element={<AdminAccounts />} />
      <Route path="media/*" element={<Media />} />
      <Route path="pages/*" element={<Pages />} />
      <Route path="blog/*" element={<Blog />} />
      <Route path="bin/*" element={<Bin />} />
      <Route path="send-mail" element={<MailForm />} />
    </Routes>
  );
};
