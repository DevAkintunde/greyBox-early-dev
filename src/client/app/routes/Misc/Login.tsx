import React, { useEffect, useContext } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import PageTitle from "../../regions/PageTitle";
import { PasswordResetForm } from "./PasswordResetForm";
import { Profile } from "../../../_cms/global/AuthFrame";
import { FormSubmit } from "../../../_cms/global/UI/formUI/FormSubmit";
import { FormUi } from "../../../_cms/global/UI/formUI/FormUi";

export const Login = () => {
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
  // signIn form fields
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

  //redirect to signed In dashboard is user is already authenticated
  useEffect(() => {
    if (profile && profile.uuid) navigate("/auth");
  }, [navigate, profile]);

  //submit signIn data
  const signIn = (data: FormData) => async (e: any) => {
    e.preventDefault();
    let response: null | { profile: object; status: number } = await FormSubmit(
      {
        e: e,
        data: data,
        endpoint: "/account/sign-in",
        header: {
          "x-requesttoken": "session", //keeps session on server
          "content-type": "multipart/form-data",
        },
      }
    );
    //console.log("returnValue", response);
    if (response && response.profile) setProfile(response.profile);
  };

  return (
    <>
      <PageTitle title="Staff Login" />
      <div className="">
        <FormUi
          id="staffLogin"
          fields={fields}
          //retrieveFormData={(data: FormData) => setData(data)}
          buttons={[
            {
              value: "Sign In",
              weight: 1,
              styling: "p-3 mx-auto",
              submit: true,
              action: signIn,
            },
          ]}
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
