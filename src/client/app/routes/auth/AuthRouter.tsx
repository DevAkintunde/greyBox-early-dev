import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Profile as UserProfile } from "../../../_cms/global/AuthFrame";
import Services from "./entities/Services";

export const AuthRouter = () => {
  const { profile }: any = useContext(UserProfile);

  const navigate = useNavigate();
  useEffect(() => {
    if (profile && profile.status === false) navigate("/");
  }, [navigate, profile]);
 
  return (
    <Routes>
      <Route path={"/services"} index element={<Services />} />
    </Routes>
  );
};
