import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../../regions/PageTitle";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import { toast } from "react-toastify";

export const AccountCreationForm = () => {
  //entity statuses
  const [roles, setRoles] = useState();
  const [output, setOutput]: any = useState({ component: "", data: {} });

  useEffect(() => {
    let isMounted = true;
    ServerHandler("field/auth/roles").then((res) => {
      if (res.status === 200 && isMounted) setRoles(res.options);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  let profileFields = [
    {
      type: "select",
      weight: -1,
      label: "Role Designation",
      id: "role",
      options: roles,
      defaultValue: roles ? "0" : "",
    },
    {
      type: "email",
      weight: 0,
      label: "Email",
      id: "email",
    },
    {
      type: "password",
      weight: 0,
      label: "Temporary Password",
      id: "password",
    },
    {
      type: "text",
      weight: 0,
      label: "First Name",
      id: "firstName",
    },
    {
      type: "text",
      weight: 0,
      label: "Last Name",
      id: "lastName",
    },
    {
      type: "tel",
      weight: 0,
      label: "Phone Number",
      id: "phoneNumber",
    },
  ];

  const createNew = (data: object) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");
    ServerHandler({
      endpoint: "auth/account/create-account",
      method: "post",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: data,
    }).then((res) => {
      //console.log(res);
      if (res.status !== 201) {
        let submitNotice = document.getElementById("form-actions-notice");
        if (submitNotice)
          submitNotice.textContent =
            res.statusText && res.statusText.includes("firstName")
              ? res.statusText &&
                res.statusText.split("firstName").join("First Name")
              : res.statusText.includes("role")
              ? res.statusText &&
                res.statusText.split("role").join("Role Designation")
              : res.statusText.includes("lastName")
              ? res.statusText &&
                res.statusText.split("lastName").join("Last Name")
              : res.statusText.includes("phoneNumber")
              ? res.statusText &&
                res.statusText.split("phoneNumber").join("Phone Number")
              : res.statusText
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
        setOutput({ component: "created", data: res.profile });
        toast(
          "New account created with " +
            res.profile.email +
            " for " +
            res.profile.firstName,
          {
            autoClose: false,
            closeOnClick: true,
          }
        );
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
      value: "Create Account",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: createNew,
    },
  ];
  //console.log(output);

  switch (output.component) {
    case "created":
      return output.data && output.data.email ? (
        <>
          <PageTitle title="Account Created" />
          <main>
            <div>
              <span>{"Email: "}</span>
              <span></span>
              {output.data.email}
            </div>
            <div>
              <span>{"Role: "}</span>
              <span></span>
              {output.data.role}
            </div>
            <div>
              <span>{"First Name: "}</span>
              <span></span>
              {output.data.firstName}
            </div>
            <div>
              <span>{"Last Name: "}</span>
              <span></span>
              {output.data.lastName ? output.data.lastName : "--"}
            </div>
            <div>
              <span>{"Phone: "}</span>
              <span></span>
              {output.data.phoneNumber ? output.data.phoneNumber : "--"}
            </div>
            <div className="mt-5 mx-auto w-fit flex gap-3">
              <Link
                to="/auth/dashboard"
                className="bg-color-ter text-color-def p-2"
              >
                Dashboard
              </Link>
              <button
                onClick={() => setOutput({ component: "", data: {} })}
                className="bg-color-pri p-2"
              >
                Create another account
              </button>
            </div>
          </main>
        </>
      ) : (
        <div>
          Oops! There was an issue getting the created profile. Contact an
          administrator.
        </div>
      );
    default:
      return (
        <>
          <PageTitle title="Create a staff account" />
          <FormUi
            fields={profileFields}
            className="max-w-screen-md"
            buttons={buttons}
            //formData={(data) => toast(data)}
          />
        </>
      );
  }
};
