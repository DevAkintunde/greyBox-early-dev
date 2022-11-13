import React, { useEffect, useState } from "react";
import { FormUi } from "../../global/FormUi";

export const FormTest = () => {
  const statusOptions = [
    { key: "draft", value: "Draft" },
    { key: "in_review", value: "In Review" },
    { key: "published", value: "Published" },
    { key: "unpublished", value: "Unpublished" },
  ];

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
      type: "select",
      weight: 0,
      container: "fromFields",
      label: "state",
      id: "state",
      options: statusOptions,
      //options: services,
    },
    {
      type: "file",
      weight: 0,
      container: "fromFields",
      label: "Feature Image",
      id: "featuredImageUri",
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

  const [data, setData]: any = useState();
  console.log("data", data);
  useEffect(() => {
    const thisForm = document.getElementById("form-ui");
    if (thisForm) {
      let fetchForm = new FormData();
      console.log("fetchForm", fetchForm);
      for (let [key, val] of fetchForm.entries()) {
        console.log("fetchForm", [key, val]);
      }
    }
  }, [data]);

  return (
    <FormUi
      id="test-form"
      //containers={containers}
      fields={fields}
      formData={(data: object) => setData(data)}
      //buttons={buttons}
      className="mx-10"
    />
  );
};
