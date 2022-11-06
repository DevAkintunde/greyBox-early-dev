import React, { useEffect, useState } from "react";
import { FormUi } from "../../../global/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const PageForm = ({ setData }: any) => {
  const statusOptions = [
    { key: "draft", state: "Draft" },
    { key: "in_review", state: "In Review" },
    { key: "published", state: "Published" },
    { key: "unpublished", state: "Unpublished" },
  ];
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
    },
    {
      type: "radio",
      weight: 0,
      container: "fromFields",
      label: "state",
      id: "state",
      //options: statusOptions,
    },
    {
      type: "url",
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

  const buttons = {
    clearButton: 2,
    cancelButton: 1,
    submit: 3,
  };

  return (
    <FormUi
      containers={containers}
      fields={fields}
      formData={(data: object) => setData(data)}
      buttons={buttons}
      className="mx-10"
    />
  );
};
