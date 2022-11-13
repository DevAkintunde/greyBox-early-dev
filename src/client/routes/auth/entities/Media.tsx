import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import PageTitle from "../../../components/blocks/PageTitle";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import FileUploadForm from "../forms/FileUploadForm";

//view all page entities

const Media = () => {
  return (
    <Routes>
      <Route path="/" index element={<ViewAllMedia />} />
      <Route path="add" element={<AddMedia />} />
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
  return (
    <>
      <PageTitle title="Add new media" />
      <div className="grid grid-flow-col gap-4 mx-auto text-4xl">
        <Link to="image" className="button-pri">
          Add Image
        </Link>
        <Link to="video" className="button-pri">
          Add Video
        </Link>
      </div>
    </>
  );
};
const AddImage = () => {
  return <FileUploadForm />;
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
