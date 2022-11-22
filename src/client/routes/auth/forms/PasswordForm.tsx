import React from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/blocks/PageTitle";
import { FormUi } from "../../../global/UI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const PasswordForm = () => {
  const navigate = useNavigate();

  let passwordFields = [
    {
      type: "password",
      weight: 0,
      label: "Password",
      id: "currentPassword",
    },
    {
      type: "password",
      weight: 1,
      label: "New Password",
      id: "newPassword",
    },
  ];

  const doUpdate = (data: object) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");
    ServerHandler({
      endpoint: "auth/account/update-password",
      method: "patch",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
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
      value: "update password",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: doUpdate,
    },
  ];

  return (
    <>
      <PageTitle title="Update password" />
      <FormUi
        fields={passwordFields}
        className="max-w-screen-sm"
        buttons={buttons}
      />
    </>
  );
};
