import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageForm } from "../../../components/auth/form/PageForm";
import PageTitle from "../../../components/blocks/PageTitle";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

//view all page entities

const Media = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllMedia />} />
      <Route path="add/*" element={<AddMedia />} />
      <Route path="add/image" element={<AddImage />} />
      <Route path="add/video" element={<AddVideo />} />
      <Route path="image/:media" element={<PerImage />} />
      <Route path="video/:media" element={<PerVideo />} />
      <Route path="image/:media/update" element={<PerImageUpdate />} />
      <Route path="video/:media/update" element={<PerVideoUpdate />} />
    </Routes>
  );
};

const ViewAllMedia = () => {
  return <></>;
};
const AddMedia = () => {
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
const AddImage = () => {
  return <></>;
};
const AddVideo = () => {
  return <></>;
};
const PerImage = () => {
  return <></>;
};
const PerVideo = () => {
  return <></>;
};
const PerImageUpdate = () => {
  return <></>;
};
const PerVideoUpdate = () => {
  return <></>;
};

export default Media;
