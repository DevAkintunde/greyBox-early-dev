import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../regions/PageTitle";
import { ServerHandler } from "../../global/functions/ServerHandler";
import validator from "validator";

export const PasswordResetForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let isMounted = true;
    let button: any = document.querySelector("input.submit");
    if (isMounted && button)
      if (validator.isEmail(email)) {
        if (button.disabled) button.disabled = false;
      } else if (!button.disabled) {
        button.disabled = true;
      }
    return () => {
      isMounted = false;
    };
  }, [email]);

  const doReset = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");
    ServerHandler({
      endpoint: "/account/reset-password",
      method: "post",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: { email: email },
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
        }
      } else {
        navigate("/");
      }
    });
  };
  const backAway = () => () => {
    window.history.back();
  };

  return (
    <>
      <PageTitle title="Update password" />

      <form id="password-reset-form" className="form-ui max-w-screen-sm">
        <div className="form-item form-item-email">
          <label>
            <span className="form-label">Email</span>
            <input
              id="email-password-reset-form"
              name="email"
              className="form-input"
              type="email"
              onChange={(e: any) => setEmail(e.target.value)}
            />
          </label>
          <div id="form-item-notice-email" className="form-item-notice"></div>
        </div>
        <div className="field-description field-description-after email-description-after field-description-email">
          Provide your email to reset your forgotten password
        </div>
        <div id="form-actions">
          <div id="form-actions-notice" />
          <div id="form-button-group" className="form-button-group">
            <input
              name="form-button"
              className="form-button bg-color-ter text-color-def"
              type="button"
              value="Back away"
              onClick={backAway}
            />
            <input
              name="form-button"
              className="form-button p-3 mx-auto submit"
              type="submit"
              value="update password"
              onClick={doReset}
            />
          </div>
        </div>
      </form>
    </>
  );
};
