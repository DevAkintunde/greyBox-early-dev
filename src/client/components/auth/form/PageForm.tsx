import React, { useEffect, useState } from "react";
import { importJsonData } from "../../../global/functions/importJsonData";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const PageForm = ({ setData }: any) => {
  const statusOptions = [
    { key: "draft", value: "Draft" },
    { key: "in_review", value: "In Review" },
    { key: "published", value: "Published" },
    { key: "unpublished", value: "Unpublished" },
  ];
  let services = ["Draft", "In Review", "Published", "Unpublished"];
  useEffect(() => {
    let isMounted = true;
    /*  promise() */
    return () => {
      isMounted = false;
    };
  }, []);

  const fromFields = {
    //type: null,
    weight: 1,
    //styling: '',
  };
  const paragraphContainer = {
    //type: null,
    weight: 2,
    indent: 2,
    //styling: '',
  };
  const containers = {
    paragraphContainer: paragraphContainer,
    fromFields: fromFields,
  };

  let fields = [
    {
      type: "text",
      weight: 0,
      container: "fromFields",
      label: "title",
      id: "title",
      required: true,
    },
    {
      type: "radio",
      weight: 0,
      container: "fromFields",
      label: "state",
      id: "state",
      options: statusOptions,
      //options: services,
    },
    {
      type: "image",
      weight: 0,
      container: "fromFields",
      label: "Feature Image",
      id: "featuredImageUri",
    },

    {
      type: "textarea",
      weight: 0,
      container: "fromFields",
      label: "summary",
      id: "summary",
    },
    {
      type: "text",
      weight: 0,
      container: "fromFields",
      label: "alias",
      id: "alias",
    },
    {
      type: "textarea",
      weight: 0,
      container: "fromFields",
      label: "Revision",
      id: "revisionNote",
    },
  ];
  console.log("json", importJsonData("serviceTypes"));
  /*   const buttons = {
    clearButton: 2,
    cancelButton: 1,
    submit: 3,
    submit: {value: 'update', weight: 3}
  }; */
  const buttons = [
    { value: "Save as draft", weight: 3, action: () => {} },
    {
      value: "update",
      weight: 3,
      styling: "p-3 mx-auto",
      submit: true,
      action: () => {},
    },
  ];

  return (
    <FormUi
      containers={containers}
      fields={fields}
      //formData={(data: object) => setData(data)}
      buttons={buttons}
      className="mx-10"
    />
  );
};
