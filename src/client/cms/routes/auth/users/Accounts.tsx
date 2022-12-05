import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountCreationForm } from "../../../components/auth/form/AccountCreationForm";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const Accounts = () => {
  return (
    <Routes>
      <Route path={"/"} index element={<FetchAccounts />} />
      <Route path="create" element={<AccountCreationForm />} />
    </Routes>
  );
};
const FetchAccounts = () => {
  const [entities, setEntities]: any = useState({});
  useEffect(() => {
    let isMounted = true;
    ServerHandler("/auth/accounts").then((res) => {
      console.log("res", res);
      if (res.status !== 200) {
        console.log(res);
        //setEntities([res.statusText]);
      } else {
        if (isMounted) setEntities(res.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return <>jjj</>;
};
