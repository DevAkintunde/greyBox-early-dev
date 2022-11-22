import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { PageForm } from "../../../components/auth/form/PageForm";
import PageTitle from "../../../components/blocks/PageTitle";
import { FormUi } from "../../../global/UI/FormUi";
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
  const createNew = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log("data", data);
    for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    }
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: `/auth/page/create`,
      method: "post",
      headers: {
        //accept: "application/json",
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
          /* if (button["disabled"] && button["disabled"] === true)
            button["disabled"] = false; */
        }
      } else {
        console.log("pageData", res);
        //navigate("/auth/media/" + type + "s/" + res.data.alias);
      }
    });
  };

  let buttons = [
    {
      value: "Create",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: createNew,
    },
  ];

  return (
    <>
      <PageTitle title="Create a page" />
      <PageForm type="create" buttons={buttons} id={"pageCreationForm"} />
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
