import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const DeleteEntity = ({
  toastText,
  destination,
}: {
  toastText?: string;
  destination: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const doDelete = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname,
      method: "delete",
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
        toast(toastText ? toastText : "Item deleted");
        navigate(destination);
      }
    });
  };
  const backAway = () => {
    window.history.back();
  };

  return (
    <div className="text-center p-5">
      <div>Confirm you want to delete this item?</div>
      <div>
        <input
          className={"form-button button-pri"}
          type="button"
          value="No"
          onClick={backAway}
        />
        <input
          className={"form-button submit button-sec"}
          type="submit"
          value="Delete Now"
          onClick={doDelete}
        />
      </div>
    </div>
  );
};
