import React, { useEffect, useState } from "react";
import { FormUi } from "../../../global/FormUi";
import { promise } from "../../../global/functions/ServerHandler";

export const PageForm = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    promise({
      endpoint: "pages/about",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    }).then((res) => {
      console.log("res", res);
    });

    return () => {};
  }, []);

  const pageFromContainer = {
    //type: null,
    weight: 0,
    indent: 4,
    //styling: '',
  };
  const containers = {
    page: pageFromContainer,
  };

  let fields = [
    {
      type: "textfield",
      weight: 0,
      container: "header",
      label: "Title",
      styling: "p-3",
    },
    {
      type: "password",
      weight: 0,
      container: "header",
      label: "Password",
      styling: "p-3",
    },
    {
      type: "email",
      weight: 0,
      container: "header",
      label: "Email",
      styling: "p-3",
    },

    {
      type: "phone",
      weight: 0,
      container: "page",
      label: "Tele",
      styling: "p-3",
    },
    {
      type: "textarea",
      weight: 0,
      container: "page",
      label: "textarea texting",
      styling: "rounded-lg",
    },
    {
      type: "radio",
      weight: 0,
      container: "page",
      label: "plain text",
      options: ["html", "css", "javascript"],
      styling: "p-3",
    },
  ];

  const buttons = {
    //styling: 'mx-auto', //string option
    styling: {
      group: "mt-5 mx-auto w-fit flex gap-3",
      clearButton: "bg-color-def p-2 capitalize",
      cancelButton: "bg-color-ter p-2 capitalize text-color-def",
      submit: "bg-color-pri p-2 capitalize",
    },
    clearButton: 2,
    cancelButton: 1,
    submit: 3,
  };
  const labelStyling = "ml-5 text-xl border-b-4 border-color-sec";
  const inputStyling = "px-2 rounded-full block w-full";

  console.log("data", data);
  return (
    <FormUi
      containers={containers}
      fields={fields}
      formData={(data: object) => setData(data)}
      buttons={buttons}
      labelStyling={labelStyling}
      inputStyling={inputStyling}
      className="mx-10"
    />
  );
};
