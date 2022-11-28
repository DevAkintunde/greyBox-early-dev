import React, { useEffect, useState } from "react";
import { FormUi } from "../../../global/UI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";

export const PageForm = ({ setData, buttons, id }: any) => {
  const [statusOptions, setStatusOptions] = useState();

  useEffect(() => {
    let isMounted = true;
    ServerHandler("/field/auth/statuses").then((res) => {
      if (res.status === 200 && isMounted) setStatusOptions(res.options);
    });

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
    weight: 2,
    indent: 2,
    //styling: '',
  };
  const containers = {
    paragraphContainer: paragraphContainer,
    fromFields: fromFields,
  };

  let paragraphs = [
    {
      type: "image",
      weight: 2,
      id: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      //defaultValue: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: {
        title: "image test here",
        uuid: "31f2b002-efe0-4af1-8871-2a68449d27f1",
      },
    },
    {
      type: "video",
      weight: 1,
      id: "45f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: {
        title: "this is video title field",
        source: "youtube",
        uuid: "45f2b002-efe0-4af1-8871-2a68449d27f1",
      },
    },
    {
      type: "text",
      weight: 3,
      //id: Math.random().toString(36).substring(2), //uuid from db when it's available
      id: "92f2b002-efe0-4af1-8871-2a68449d27f1",
      defaultValue: "this is a test text field alone",
    },
  ];

  let fields = [
    {
      type: "image",
      weight: 0,
      container: "fromFields",
      label: "Featured Image",
      id: "featuredImage",
      defaultValue: {
        uuid: "31f2b002-efe0-4af1-8871-2a68449d27f1",
        title: "featured image title",
      },
      //defaultValue: "31f2b002-efe0-4af1-8871-2a68449d27f1",
    },
    {
      type: "text",
      weight: 0,
      container: "fromFields",
      label: "title",
      id: "title",
      required: true,
    },
    {
      type: "textarea",
      weight: 0,
      container: "fromFields",
      label: "summary",
      id: "summary",
    },
    {
      type: "radio",
      weight: 0,
      container: "fromFields",
      label: "Status",
      id: "status",
      options: statusOptions,
    },
    {
      type: "textarea",
      weight: 0,
      container: "fromFields",
      label: "Revision",
      id: "revisionNote",
    },
    {
      type: "paragraph",
      weight: 0,
      container: "fromFields",
      label: "Body",
      id: "body",
      defaultValue: paragraphs,
    },
  ];

  return (
    <FormUi containers={containers} id={id} fields={fields} buttons={buttons} />
  );
};
