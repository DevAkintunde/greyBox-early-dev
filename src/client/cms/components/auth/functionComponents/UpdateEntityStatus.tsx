import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import Loading from "../../../utils/Loading";
import PageTitle from "../../blocks/PageTitle";

export const UpdateEntityStatus = ({
  toastText,
  destination,
}: {
  toastText?: string;
  destination?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus]: any = useState();
  const [statuses, setStatuses]: [object[], any] = useState([]);
  /* fetch database statuses options */
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/field/auth/statuses").then((res) => {
      if (res.status === 200 && isMounted) return setStatuses(res.options);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  /* existing entity status */
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname.split("/update/status")[0]).then((res) => {
      if (res.status === 200 && isMounted) return setStatus(res.data.status);
    });
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  const doSubmit = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname,
      method: "patch",
      body: { status: status },
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
        toast(toastText ? toastText : "Status updated.");
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
          <label htmlFor="status" className="form-label">
            Update Status
          </label>

          {status && statuses && statuses.length > 0 ? (
            <select
              id="status"
              onChange={(e) => setStatus(e.target.value)}
              className={"form-input"}
              defaultValue={status}
              required={true}
            >
              {statuses.map((status, index): any => {
                return (
                  <option
                    key={index}
                    value={status["key" as keyof typeof status]}
                  >
                    {status["value" as keyof typeof status]}
                  </option>
                );
              })}
            </select>
          ) : (
            <Loading />
          )}
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
