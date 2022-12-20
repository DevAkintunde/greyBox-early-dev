import React, { useContext } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { Profile } from "../../../global/AppFrame";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import avatar from "../../../utils/images/avatar.webp";

export const Dashboard = () => {
  const { profile }: any = useContext(Profile);
  console.log(profile);
  //recent activities
  //profile detail
  return (
    <div>
      <PageTitle title={"Dashboard"} />
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.firstName} />
          ) : (
            <img
              src={avatar}
              alt={profile.firstName ? profile.firstName : profile.email}
            />
          )}
        </div>
        <div>
          <div>
            {profile.firstName +
              (profile.lastName ? " " + profile.lastName : "")}
          </div>
          <div>Role: {profile.type}</div>
          <div>Privilege: {profile.role}</div>
          <div>
            {"Since: "}
            {dateFormatter({ date: profile.created, format: "teaser" })}
            {` (${dateFormatter({
              date: profile.created,
              format: "timeago",
            })})`}
          </div>
          <Link to="profile">Go to Profile</Link>
        </div>
      </div>
    </div>
  );
};
