import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/blocks/PageTitle";
import { FormUi } from "../../global/FormUi";
import { ServerHandler } from "../../global/functions/ServerHandler";

export const StaffLogin = () => {
  return (
    <Routes>
      <Route path={"/"} element={<SignIn />} />
      <Route path="reset-password" index element={<ResetPassword />} />
    </Routes>
  );
};
const ResetPassword = () => {
  const [data, setData] = useState({});
  let fields = [
    {
      type: "email",
      weight: 0,
      label: "Email",
      id: "email",
    },
  ];
  return (
    <>
      <PageTitle title="Reset Password" />
      <div className="">
        <FormUi
          fields={fields}
          formData={(data: object) => setData(data)}
          className="max-w-screen-sm"
        />
      </div>
    </>
  );
};

const SignIn = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    ServerHandler({
      endpoint: "account/sign-in",
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        //"x-requesttoken": "cookie",
      },
      body: {
        data: {
          email: "jshdidijsxsxnsxhs",
          password: "sdhijdjexmdhuhdu",
        },
      },
    }).then((res) => {
      console.log("res", res);
    });
    return () => {};
  }, []);

  let fields = [
    {
      type: "email",
      weight: 0,
      label: "Email",
      id: "email",
    },
    {
      type: "password",
      weight: 0,
      label: "Password",
      id: "password",
    },
  ];

  console.log("data", data);
  return (
    <>
      <PageTitle title="Staff Login" />
      <div className="">
        <FormUi
          fields={fields}
          formData={(data: object) => setData(data)}
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
