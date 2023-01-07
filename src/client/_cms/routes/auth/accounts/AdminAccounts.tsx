import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AccountCreationForm } from "../../../components/forms/auth/AccountCreationForm";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import PageTitle from "../../../regions/PageTitle";
import Loading from "../../../utils/Loading";
import { Image } from "../../../components/Image";
import { dateFormatter } from "../../../global/functions/dateFormatter";
import avatar from "../../../utils/images/avatar.webp";
import { toast } from "react-toastify";

export const AdminAccounts = () => {
  return (
    <Routes>
      <Route path={"/"} index element={<FetchAccounts />} />
      <Route path={"/:email"} index element={<ViewSingleAccount />} />
      <Route path={"/:email/block"} index element={<BlockAccount />} />
      <Route path="create" element={<AccountCreationForm />} />
    </Routes>
  );
};
const FetchAccounts = () => {
  const [entities, setEntities]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/accounts").then((res) => {
      if (res.status !== 200) {
        //console.log(res);
        //setEntities([res.statusText]);
      } else {
        if (isMounted) setEntities(res.data.admin);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  //console.log("entities", entities);
  return (
    <>
      <PageTitle title="Admin Accounts" />
      {entities ? (
        <div>
          {entities.length > 0 ? (
            <table className="table">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th></th>
                  <th></th>
                  <th>Email</th>
                  <th>F.Name</th>
                  <th>L.Name</th>
                  <th>Priv.</th>
                  <th>Phone No.</th>
                  <th>Last Seen</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity: any, index: number) => {
                  return (
                    <tr key={entity.uuid} className="table-row">
                      <td className="table-cell">{index + 1}</td>
                      <td className="table-cell">
                        <Link to={entity.avatar}>
                          <Image src={entity.avatar} alt={entity.firstName} />
                        </Link>
                      </td>
                      <td className="table-cell">
                        <Link to={entity.email}>{entity.email}</Link>
                      </td>
                      <td className="table-cell">{entity.firstName}</td>
                      <td className="table-cell">
                        {entity.lastName ? entity.lastName : "-"}
                      </td>
                      <td className="table-cell">{entity.role}</td>
                      <td className="table-cell">
                        {entity.phoneNumber ? entity.phoneNumber : "-"}
                      </td>
                      <td className="table-cell">
                        {entity.access && entity.access.signedIn
                          ? dateFormatter({
                              date: entity.access.signedIn,
                              format: "timeago",
                            })
                          : "-"}
                      </td>
                      <td>
                        <Link
                          to={entity.email + "/block"}
                          className="button-sec"
                        >
                          Suspend
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <Loading message={"Admin users yet to be created!"} />
          )}
        </div>
      ) : (
        <Loading infinitylyLoad={true} />
      )}
    </>
  );
};

const ViewSingleAccount = () => {
  let location = useLocation();
  const navigate = useNavigate();
  const [notOkResponse, setNotOkResponse] = useState();

  const [entity, setEntity]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler(location.pathname.split("/admin")[1] + "?include=role").then(
      (res) => {
        if (isMounted && res) {
          //console.log("res", res);
          if (res.status === 200) {
            setEntity(res.data);
          } else if (res.status === 404) {
            navigate("/404");
          } else {
            setNotOkResponse(res.statusText);
          }
        } else {
          navigate("/404");
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  return entity ? (
    <>
      {entity && entity.uuid ? (
        <>
          <PageTitle
            title={
              "Admin account: " +
              entity.firstName +
              (entity.lastName
                ? " " + entity.lastName.substring(0, 1) + "."
                : "")
            }
          />
          <div className="grid gap-4">
            <div className="mx-auto">
              {entity.avatar ? (
                <img src={entity.avatar} alt={entity.firstName} />
              ) : (
                <img
                  src={avatar}
                  alt={entity.firstName ? entity.firstName : entity.email}
                />
              )}
            </div>
            <div className="mx-auto">
              <div>
                {" "}
                <span>{"First Name: "}</span>
                <span>{entity.firstName}</span>
              </div>
              <div>
                <span>{"Other Name: "}</span>
                <span>{entity.lastName}</span>
              </div>
              <div>
                <span>{"Role: "}</span>
                <span>{entity.type}</span>
              </div>
              <div>
                <span>{"Privilege: "}</span>
                <span>{entity.role}</span>
              </div>
              <div>
                <span>{"Last seen: "}</span>
                <span>
                  {entity.access && entity.access.signedIn
                    ? dateFormatter({
                        date: entity.access.signedIn,
                        format: "timeago",
                      })
                    : "-"}
                </span>
              </div>
              <div>
                <span>{"Registered since: "}</span>
                <span>
                  {dateFormatter({ date: entity.created, format: "teaser" })}
                  {` (${dateFormatter({
                    date: entity.created,
                    format: "timeago",
                  })})`}
                </span>
              </div>
              <div className="text-center">
                <Link to={location.pathname + "/block"} className="button-sec">
                  Suspend
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading
          message={notOkResponse}
          infinitylyLoad={notOkResponse ? true : false}
        />
      )}
    </>
  ) : (
    <Loading infinitylyLoad={true} />
  );
};

const BlockAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let email = useParams().email;
  const [entity, setEntity]: any = useState();
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/accounts/" + email).then((res) => {
      if (isMounted && res) {
        if (res.status === 200) {
          setEntity(res.data);
        } else if (res.status === 404) {
          navigate("/404");
        }
      } else {
        navigate("/404");
      }
    });
    return () => {
      isMounted = false;
    };
  }, [email, navigate]);

  const doSuspend = (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: location.pathname.split("/admin")[1],
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
        toast("account suspended");
        window.history.back();
      }
    });
  };
  const backAway = () => {
    window.history.back();
  };

  return (
    <div className="text-center p-5">
      <div>
        {entity
          ? `Confirm you want to suspend ${entity.firstName}'s (${entity.email}) account?`
          : "Confirm you want to suspend this account?"}
      </div>
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
          value="Suspend account"
          onClick={doSuspend}
        />
      </div>
    </div>
  );
};
