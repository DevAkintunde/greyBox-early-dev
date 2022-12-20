import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageForm } from "../../../components/auth/form/PageForm";
import PageTitle from "../../../regions/PageTitle";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

//view all Service entities

const Services = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewServices />} />
      <Route path="add" element={<AddService />} />
      <Route path=":Service" element={<PerService />} />
      <Route path=":Service/update" element={<PerServiceUpdate />} />
    </Routes>
  );
};

const ViewServices = () => {
  return <></>;
};
const AddService = () => {
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
      <PageTitle title="Create a Service" />
      <PageForm setData={setData} />
    </>
  );
};
const PerService = () => {
  return <></>;
};
const PerServiceUpdate = () => {
  return <></>;
};

export default Services;
