import React, { useContext } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { PasswordForm } from "../../../components/auth/form/PasswordForm";
import { ProfileForm } from "../../../components/auth/form/ProfileForm";
import PageTitle from "../../../regions/PageTitle";
import { Profile as ProfileData } from "../../../global/AppFrame";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import avatar from "../../../utils/images/avatar.webp";

export const Profile = () => {
  return (
    <Routes>
      <Route path="/" element={<ThisProfile />} />
      <Route path="update" element={<ProfileForm />} />
      <Route path="update-password" element={<PasswordForm />} />
    </Routes>
  );
};

const ThisProfile = () => {
  const { profile }: any = useContext(ProfileData);
  return (
    <div>
      <PageTitle title={"My Profile"} />
      <div className="grid gap-4">
        <div className="mx-auto">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.firstName} />
          ) : (
            <img
              src={avatar}
              alt={profile.firstName ? profile.firstName : profile.email}
            />
          )}
        </div>
        <div className="mx-auto">
          <div>
            {" "}
            <span>{"First Name: "}</span>
            <span>{profile.firstName}</span>
          </div>
          <div>
            <span>{"Other Name: "}</span>
            <span>{profile.lastName}</span>
          </div>
          <div>
            <span>{"Role: "}</span>
            <span>{profile.type}</span>
          </div>
          <div>
            <span>{"Privilege: "}</span>
            <span>{profile.role}</span>
          </div>
          <div>
            <span>{"Since: "}</span>
            <span>
              {dateFormatter({ date: profile.created, format: "teaser" })}
              {` (${dateFormatter({
                date: profile.created,
                format: "timeago",
              })})`}
            </span>
          </div>
          <div className="text-center">
            <Link to="update" className="button-pri">
              Update
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
