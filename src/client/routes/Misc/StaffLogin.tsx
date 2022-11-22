import React, { useEffect, useState, useContext } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import PageTitle from "../../components/blocks/PageTitle";
import { FormUi } from "../../global/UI/FormUi";
import { ServerHandler } from "../../global/functions/ServerHandler";
import { Profile } from "../../global/AppFrame";
import { PasswordResetForm } from "./PasswordResetForm";

export const StaffLogin = () => {
  return (
    <Routes>
      <Route path={"/"} element={<SignIn />} />
      <Route path="/forgot-password" index element={<PasswordResetForm />} />
    </Routes>
  );
};

const SignIn = () => {
  const navigate = useNavigate();
  const { profile, setProfile }: any = useContext(Profile);
  // form data
  let fields = [
    {
      type: "email",
      weight: 0,
      label: "Email",
      id: "email",
    },
    {
      type: "password",
      weight: 1,
      label: "Password",
      id: "password",
      required: true,
    },
  ];

  const [data, setData]: any = useState();
  useEffect(() => {
    if (profile && profile.uuid) navigate("/auth");
  }, [navigate, profile]);

  console.log("data", data);

  useEffect(() => {
    let isMounted = true;
    const signIn = async () => {
      ServerHandler({
        endpoint: "/account/sign-in",
        method: "POST",
        headers: {
          "x-requesttoken": "session",
          "content-type": "multipart/form-data",
        },
        body: data,
      }).then((res) => {
        console.log("res", res);
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
            if (button["disabled"] && button["disabled"] === true)
              button["disabled"] = false;
          }
        } else {
          setProfile(res.profile);
        }
      });
    };

    if (data && isMounted) {
      let button: any = document.querySelector("input.submit");
      if (button && button.classList) button.classList.add("bounce");
      signIn();
      /* else {
        if (button["disabled"] && button["disabled"] === true)
          button["disabled"] = false;
      } */
    }
    return () => {
      isMounted = false;
    };
  }, [data, setProfile]);

  return (
    <>
      <PageTitle title="Staff Login" />
      <div className="">
        <FormUi
          id="staffLogin"
          fields={fields}
          formData={(data: FormData) => setData(data)}
          /* buttons={[
            {
              value: "Upload",
              weight: 1,
              styling: "p-3 mx-auto",
              submit: true,
              action: () => setData(data),
            },
          ]} */
          className="max-w-screen-sm"
        />
        <Link
          to="forgot-password"
          className="text-color-ter mt-10 block text-center capitalize"
        >
          Forgot Password
        </Link>
      </div>
    </>
  );
};
