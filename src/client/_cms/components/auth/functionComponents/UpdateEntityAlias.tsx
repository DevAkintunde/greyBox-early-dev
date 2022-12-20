import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import PageTitle from "../../../regions/PageTitle";

export const UpdateEntityAlias = ({
  toastText,
  destination,
}: {
  toastText?: string;
  destination?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newAlias, setNewAlias]: any = useState();

  const doSubmit = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname,
      method: "patch",
      body: { alias: newAlias },
    }).then((res) => {
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
        toast(toastText ? toastText : "Alias updated.");
        if (destination) {
          navigate(destination);
        } else {
          navigate("/auth/pages/" + res.data.alias);
        }
      }
    });
  };
  const backAway = () => {
    window.history.back();
  };

  return (
    <>
      <PageTitle title="Set new path" />
      <form className="form-ui">
        <div className="form-item">
          <label htmlFor="alias" className="form-label">
            New Alias
          </label>
          <input
            id="alias"
            className="form-input"
            type="text"
            onChange={(e) => setNewAlias(e.target.value)}
          />
        </div>
        <div id="form-actions" className="text-center">
          <input
            className={"form-button"}
            type="button"
            value="No"
            onClick={backAway}
          />
          <input
            className={"form-button submit button-pri"}
            type="submit"
            value="Update"
            onClick={doSubmit}
          />
        </div>
      </form>
    </>
  );
};
