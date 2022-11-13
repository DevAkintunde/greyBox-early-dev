import React, { useEffect, useState } from "react";
import PageTitle from "../../components/blocks/PageTitle";
import { FormUi } from "../../global/FormUi";

export const ContactForm = ({ className }: any) => {
  const [data, setData] = useState({});

  let fields = [
    {
      type: "text",
      weight: 0,
      label: "Name",
    },
    {
      type: "text",
      weight: 1,
      label: "Title",
    },
    {
      type: "textarea",
      weight: 2,
      label: "Message",
    },
  ];
  let buttons = { clearButton: 2 };

  return (
    <FormUi
      fields={fields}
      //buttons={buttons}
      formData={(data: object) => setData(data)}
      className="max-w-screen-sm"
    />
  );
};
