import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageForm } from "../../../components/auth/form/PageForm";
import PageTitle from "../../../components/blocks/PageTitle";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

//view all page entities

const Pages = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewPages />} />
      <Route path="create" element={<CreatePage />} />
      <Route path=":page" element={<PerPage />} />
      <Route path=":page/update" element={<PerPageUpdate />} />
    </Routes>
  );
};

const ViewPages = () => {
  return <></>;
};
const CreatePage = () => {
  const location = useLocation();
  const [data, setData] = useState({});
  useEffect(() => {
    /* ServerHandler({
      endpoint: location.pathname,
      method: "post",
      body: {},
    }); */

    return () => {};
  }, []);
  console.log(data);
  return (
    <>
      <PageTitle title="Create a page" />
      <PageForm setData={setData} />
    </>
  );
};
const PerPage = () => {
  return <></>;
};
const PerPageUpdate = () => {
  return <></>;
};

export default Pages;
