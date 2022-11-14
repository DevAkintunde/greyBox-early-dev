import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "../../../components/blocks/PageTitle";
import { Profile } from "../../../global/AppFrame";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const ProfileForm = () => {
  const { profile, setProfile }: any = useContext(Profile);
  const navigate = useNavigate();

  const removeAvatar = () => {
    ServerHandler({
      method: "delete",
      endpoint: "auth/account/delete-avatar",
    }).then((res) => {
      setProfile(res.profile);
      toast(res.statusText);
    });
  };
  let profileFields = [
    {
      type: "file",
      weight: 0,
      label: "Avatar",
      id: "avatar",
      defaultValue: profile["avatar"],
      extraElement: profile.avatar ? (
        <input value="Remove" onClick={removeAvatar} type="button" />
      ) : null,
    },
    {
      type: "text",
      weight: 0,
      label: "First Name",
      id: "firstName",
      defaultValue: profile["firstName"],
    },
    {
      type: "text",
      weight: 0,
      label: "Last Name",
      id: "lastName",
      defaultValue: profile["lastName"],
    },
    {
      type: "tel",
      weight: 0,
      label: "Phone Number",
      id: "phoneNumber",
      defaultValue: profile["phoneNumber"],
    },
  ];

  const doUpdate = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log("data", data);
    for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    }
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");
    ServerHandler({
      endpoint: "/auth/account/update",
      method: "patch",
      headers: {
        accept: "application/json",
      },
      body: data,
    }).then((res) => {
      //console.log("res", res);
      if (res.status !== 200) {
        let submitNotice = document.getElementById("form-actions-notice");
        if (submitNotice)
          submitNotice.textContent = res.statusText
            ? res.statusText
            : "Oops! There was a problem somewhere. Please try again";
        let button: any = document.querySelector("input.submit");
        if (button) {
          if (button.classList && button.classList.contains("bounce"))
            button.classList.remove("bounce");
          /* if (button["disabled"] && button["disabled"] === true)
            button["disabled"] = false; */
        }
      } else {
        setProfile(res.profile);
        navigate("/auth");
      }
    });
  };
  const backAway = () => () => {
    window.history.back();
  };

  let buttons = [
    {
      value: "Back away",
      styling: "bg-color-ter text-color-def",
      weight: 0,
      action: backAway,
    },
    {
      value: "update",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: doUpdate,
    },
  ];

  return (
    <>
      <PageTitle title="Update profile" />
      <FormUi
        id="profileForm"
        fields={profileFields}
        //formData={(data: any) => setProfileData(data)}
        className="max-w-screen-sm"
        buttons={buttons}
      />
    </>
  );
};
